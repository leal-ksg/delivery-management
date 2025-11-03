import { Product } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";

export interface IProductRepository {
  findAll(): Promise<Result<Product[]>>;
  findById(id: string): Promise<Result<Product | null>>;
  create(product: Omit<Product, "id">): Promise<Result<Product>>;
  update(id: string, product: Partial<Product>): Promise<Result<Product>>;
  delete(id: string): Promise<Result<void>>;
}

export interface IProductController {
  getAllProducts(): Promise<HttpResponse<Product[]>>;
  getProductById(id: string): Promise<HttpResponse<Product | null>>;
  createProduct(product: Omit<Product, "id">): Promise<HttpResponse<Product>>;
  updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<HttpResponse<Product>>;
  deleteProduct(id: string): Promise<HttpResponse<void>>;
}
