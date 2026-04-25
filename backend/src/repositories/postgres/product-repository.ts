import { PrismaClient, Product } from "../../../generated/prisma";
import {
  CreateProductDTO,
  IProductRepository,
} from "../../controllers/product/interfaces";
import { Pagination } from "../../core/pagination";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class ProductRepository implements IProductRepository {
  async findAll(
    query?: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<Product>>> {
    itemsPerPage = Math.min(50, Math.max(1, itemsPerPage ?? 10));
    page = Math.max(1, page ?? 1);

    const search = query?.trim() ?? "";

    try {
      const [products, total] = await Promise.all([
        prisma.$queryRaw<
          (Product & {
            stockQuantity: number | null;
            totalCost: number;
          })[]
        >`
      SELECT
        p.*,
        s.quantity as "stockQuantity",
        get_product_total_cost(p.id) as "totalCost"
      FROM "Product" p
      LEFT JOIN "Stock" s
        ON s."productId" = p.id
      WHERE
        (
          ${search} = ''
          OR p.name ILIKE '%' || ${search} || '%'
        )
      ORDER BY p.name
      LIMIT ${itemsPerPage}
      OFFSET ${(page - 1) * itemsPerPage}
      `,

        prisma.product.count({
          where: search
            ? {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              }
            : {},
        }),
      ]);

      return {
        ok: true,
        body: {
          list: products,
          total,
          itemsPerPage,
          page,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto"),
      };
    }
  }

  async findById(id: string): Promise<Result<Product | null>> {
    try {
      console.log(id);
      const product = await prisma.product.findUnique({ where: { id } });

      return { ok: true, body: product };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto"),
      };
    }
  }

  async create(
    product: CreateProductDTO,
    transaction: PrismaClient,
  ): Promise<Result<Product>> {
    try {
      const createdProduct = await transaction.product.create({
        data: {
          ...product,
          type: product.type ?? "PURCHASE",
          consumptionType: product.consumptionType ?? "PRODUCTION",
        },
      });

      return { ok: true, body: createdProduct };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async update(
    id: string,
    product: Partial<Product>,
    transaction: PrismaClient,
  ): Promise<Result<Product>> {
    try {
      if (!Object.keys(product).length) {
        return { ok: true, body: {} as Product };
      }

      const updatedProduct = await transaction.product.update({
        where: { id },
        data: product,
      });

      return { ok: true, body: updatedProduct };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async delete(ids: string[]): Promise<Result<void>> {
    try {
      await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { active: false },
      });

      return { ok: true, body: undefined };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }
}
