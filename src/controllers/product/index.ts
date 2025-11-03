import { Product } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { IProductController, IProductRepository } from "./interfaces";

export class ProductController implements IProductController {

    constructor(private readonly productRepository: IProductRepository) {}

    async getAllProducts(): Promise<HttpResponse<Product[]>> {
        const result = await this.productRepository.findAll()

        return toHttpResponse(result)
    }

    async getProductById(id: string): Promise<HttpResponse<Product | null>> {
        const result = await this.productRepository.findById(id)

        return toHttpResponse(result)
    }

    async createProduct(product: Omit<Product, "id">): Promise<HttpResponse<Product>> {
        const result = await this.productRepository.create(product)

        return toHttpResponse(result)
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<HttpResponse<Product>> {
        const result = await this.productRepository.update(id, product)

        return toHttpResponse(result)
    }

    async deleteProduct(id: string): Promise<HttpResponse<void>> {
        const result = await this.productRepository.delete(id)

        return toHttpResponse(result)
    }
}