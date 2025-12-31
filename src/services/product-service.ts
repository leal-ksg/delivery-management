import { Product } from "../../generated/prisma";
import {
  CreateProductDTO,
  IProductRepository,
  IProductService,
} from "../controllers/product/interfaces";
import { IStockRepository } from "../controllers/stock/interfaces";
import { parseDatabaseErrorMessage } from "../core/parse-database-error-message";
import { Result } from "../core/result";
import { prisma } from "../database/prisma";

export class ProductService implements IProductService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly stockRepo: IStockRepository
  ) {}

  async createProduct(product: CreateProductDTO): Promise<Result<Product>> {
    try {
      const creationResult = await prisma.$transaction(async (transaction) => {
        const productResult = await this.productRepo.create(product, transaction);

        if (!productResult.ok) {
          throw new Error(productResult.error ?? 'Não foi possível criar o produto')
        }

        const stockResult = await this.stockRepo.create(
          { productId: productResult.body.id, quantity: 0 },
          transaction
        );

        if (!stockResult.ok) {
          throw new Error(stockResult.error ?? 'Não foi iniciar o estoque do produto')
        }

        return productResult;
      });

      return creationResult;
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produto") };
    }
  }
}
