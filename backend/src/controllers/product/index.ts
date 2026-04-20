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
  ProductDTO,
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
    query?: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<ProductDTO>>> {
    const result = await this.productRepository.findAll(
      query,
      itemsPerPage,
      page,
    );

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
    const result = await this.service.updateProduct(id, product);

    return toHttpResponse(result, 201);
  }

  async deleteProduct(ids: string[]): Promise<HttpResponse<void>> {
    const result = await this.productRepository.delete(ids);

    return toHttpResponse(result);
  }
}
