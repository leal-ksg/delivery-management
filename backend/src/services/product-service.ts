import { Product } from "../../generated/prisma";
import {
  CreateProductDTO,
  IProductRepository,
  IProductService,
  UpdateProductDTO,
} from "../controllers/product/interfaces";
import { IStockRepository } from "../controllers/stock/interfaces";
import { isNotNullOrUndefined } from "../core/is-not-null-or-undefined";
import { parseDatabaseErrorMessage } from "../core/parse-database-error-message";
import { Result } from "../core/result";
import { prisma } from "../database/prisma";

export class ProductService implements IProductService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly stockRepo: IStockRepository,
  ) {}

  async createProduct(product: CreateProductDTO): Promise<Result<Product>> {
    try {
      const creationResult = await prisma.$transaction(async (transaction) => {
        const { stockQuantity, ...createdProduct } = product;

        const productResult = await this.productRepo.create(
          createdProduct,
          transaction,
        );

        if (!productResult.ok) {
          throw new Error(
            productResult.error ?? "Não foi possível criar o produto",
          );
        }

        const stockResult = await this.stockRepo.create(
          {
            productId: productResult.body.id,
            quantity: stockQuantity ?? 0,
          },
          transaction,
        );

        if (!stockResult.ok) {
          throw new Error(
            stockResult.error ?? "Não foi iniciar o estoque do produto",
          );
        }

        return productResult;
      });

      return creationResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produto") };
    }
  }

  async updateProduct(
    id: string,
    product: UpdateProductDTO,
  ): Promise<Result<Product>> {
    try {
      const updateResult = await prisma.$transaction(async (transaction) => {
        const { stockQuantity, ...updatedProduct } = product;

        const productResult = await this.productRepo.update(
          id,
          updatedProduct,
          transaction,
        );

        if (!productResult.ok) {
          throw new Error(
            productResult.error ?? "Não foi possível atualizar o produto",
          );
        }

        if (isNotNullOrUndefined(stockQuantity)) {
          const stockResult = await this.stockRepo.update(
            {
              productId: id,
              quantity: stockQuantity,
            },
            transaction,
          );

          if (!stockResult.ok) {
            throw new Error(
              stockResult.error ?? "Não foi atualizar o estoque do produto",
            );
          }
        }

        return productResult;
      });

      return updateResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produto") };
    }
  }
}
