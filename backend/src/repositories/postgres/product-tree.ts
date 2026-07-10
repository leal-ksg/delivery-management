import { ProductTree } from "../../../generated/prisma";
import {
  DeleteProductTreeDTO,
  IProductTreeRepository,
  ProductTreeDTO,
} from "../../controllers/product-tree/interfaces";
import { Pagination } from "../../core/pagination";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class ProductTreeRepository implements IProductTreeRepository {
  async findByParentId(
    parentId: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<ProductTreeDTO>>> {
    itemsPerPage = Math.min(50, Math.max(1, itemsPerPage ?? 10));
    page = Math.max(1, page ?? 1);

    try {
      const select = { id: true, name: true, active: true };

      const [products, total] = await Promise.all([
        prisma.productTree.findMany({
          where: { parentId },
          include: { parent: { select }, child: { select } },
          orderBy: [
            {
              parent: {
                id: "asc",
              },
            },
            {
              child: {
                name: "asc",
              },
            },
          ],
          take: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
        }),
        prisma.productTree.count({
          where: { parentId },
        }),
      ]);

      return {
        ok: true,
        body: { list: products, total, itemsPerPage, page },
      };
    } catch (error) {
      return { ok: false, error: parseDatabaseErrorMessage(error, "Produto") };
    }
  }

  async create(products: ProductTree[]): Promise<Result<void>> {
    try {
      await prisma.productTree.createMany({
        data: products,
      });

      return { ok: true, body: undefined };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }

  async update(product: ProductTree): Promise<Result<ProductTree>> {
    try {
      const { childId, parentId, childQuantity } = product;

      const updatedNode = await prisma.productTree.update({
        where: {
          childId_parentId: {
            childId,
            parentId,
          },
        },
        data: {
          childQuantity,
        },
      });

      return { ok: true, body: updatedNode };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }

  async delete(products: DeleteProductTreeDTO[]): Promise<Result<void>> {
    try {
      await prisma.productTree.deleteMany({
        where: {
          OR: products.map((p) => ({
            parentId: p.parentId,
            childId: p.childId,
          })),
        },
      });

      return {
        ok: true,
        body: undefined,
      };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }
}
