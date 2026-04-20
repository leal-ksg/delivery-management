import {
  Prisma,
  Product,
  ConsumptionType,
  ProductType,
} from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { Result } from "../../core/result";

export interface ProductDTO extends Product {
  stockQuantity?: number;
}

export interface CreateProductDTO {
  name: string;
  description: string | null;
  unitPrice: Prisma.Decimal;
  minStock: number;
  consumptionType: ConsumptionType | null;
  type: ProductType | null;
  stockQuantity?: number;
}

export interface UpdateProductDTO extends Partial<Product> {
  stockQuantity?: number;
}

export interface IProductRepository {
  findAll(
    query?: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<ProductDTO>>>;
  findById(id: string): Promise<Result<Product | null>>;
  create(
    product: CreateProductDTO,
    transaction: Prisma.TransactionClient,
  ): Promise<Result<Product>>;
  update(
    id: string,
    product: Partial<Product>,
    transaction: Prisma.TransactionClient,
  ): Promise<Result<Product>>;
  delete(ids: string[]): Promise<Result<void>>;
}

export interface IProductController {
  getAllProducts(
    query?: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<ProductDTO>>>;
  getProductById(id: string): Promise<HttpResponse<Product | null>>;
  createProduct(product: CreateProductDTO): Promise<HttpResponse<Product>>;
  updateProduct(
    id: string,
    product: Partial<Product>,
  ): Promise<HttpResponse<Product>>;
  deleteProduct(ids: string[]): Promise<HttpResponse<void>>;
}

export interface IProductService {
  createProduct(product: CreateProductDTO): Promise<Result<Product>>;
  updateProduct(
    id: string,
    product: UpdateProductDTO,
  ): Promise<Result<Product>>;
}
