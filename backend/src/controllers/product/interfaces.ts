import { Prisma, Product } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";

export interface CreateProductDTO {
  name: string;
  description: string  | null;
  unitPrice: Prisma.Decimal;
  categoryId: number;
  minStock: number;
}

export interface IProductRepository {
  findAll(): Promise<Result<Product[]>>;
  findById(id: string): Promise<Result<Product | null>>;
  create(product: CreateProductDTO, transaction: Prisma.TransactionClient): Promise<Result<Product>>;
  update(id: string, product: Partial<Product>): Promise<Result<Product>>;
  delete(id: string): Promise<Result<void>>;
}

export interface IProductController {
  getAllProducts(): Promise<HttpResponse<Product[]>>;
  getProductById(id: string): Promise<HttpResponse<Product | null>>;
  createProduct(product: CreateProductDTO): Promise<HttpResponse<Product>>;
  updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<HttpResponse<Product>>;
  deleteProduct(id: string): Promise<HttpResponse<void>>;
}

export interface IProductService {
  createProduct(product: CreateProductDTO): Promise<Result<Product>> 
}