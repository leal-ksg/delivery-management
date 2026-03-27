import { Product } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { ProductService } from "../../services/product-service";
import { IStockRepository } from "../stock/interfaces";
import {
  CreateProductDTO,
  IProductController,
  IProductRepository,
  IProductService,
} from "./interfaces";

export class ProductController implements IProductController {
  service: IProductService;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly stockRepository: IStockRepository,
  ) {
    this.service = new ProductService(productRepository, stockRepository);
  }

  async getAllProducts(
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<Product>>> {
    const result = await this.productRepository.findAll(itemsPerPage, page);

    return toHttpResponse(result);
  }

  async getProductById(id: string): Promise<HttpResponse<Product | null>> {
    const result = await this.productRepository.findById(id);

    return toHttpResponse(result);
  }

  async createProduct(
    product: CreateProductDTO,
  ): Promise<HttpResponse<Product>> {
    const result = await this.service.createProduct(product);

    return toHttpResponse(result, 201);
  }

  async updateProduct(
    id: string,
    product: Partial<Product>,
  ): Promise<HttpResponse<Product>> {
    const result = await this.productRepository.update(id, product);

    return toHttpResponse(result);
  }

  async deleteProduct(ids: string[]): Promise<HttpResponse<void>> {
    const result = await this.productRepository.delete(ids);

    return toHttpResponse(result);
  }
}
