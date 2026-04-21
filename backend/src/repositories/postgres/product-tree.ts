import { ProductTree } from "../../../generated/prisma";
import {
  IProductTreeRepository,
  ProductTreeDTO,
} from "../../controllers/product-tree/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class ProductTreeRepository implements IProductTreeRepository {
  async findById(parentId: string): Promise<Result<ProductTreeDTO[]>> {
    try {
      const select = { id: true, name: true, active: true };

      const products = await prisma.productTree.findMany({
        where: { parentId },
        include: { parent: { select }, child: { select } },
      });

      return { ok: true, body: products };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }

  async create(products: ProductTree[]): Promise<Result<ProductTree[]>> {
    try {
      const createdProducts = await prisma.productTree.createManyAndReturn({
        data: products,
      });

      return { ok: true, body: createdProducts };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }

  async replace(
    parentId: string,
    products: ProductTree[],
  ): Promise<Result<ProductTree[]>> {
    try {
      const replacedProducts = await prisma.$transaction(
        async (transaction) => {
          await transaction.productTree.deleteMany({ where: { parentId } });

          return await transaction.productTree.createManyAndReturn({
            data: products,
          });
        },
      );

      return { ok: true, body: replacedProducts };
    } catch (error) {
      return {
        ok: false,
        error: parseDatabaseErrorMessage(error, "Produto da árvore"),
      };
    }
  }
}
