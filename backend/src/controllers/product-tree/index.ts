import { ProductTree } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { IProductTreeController, IProductTreeRepository } from "./interfaces";

export class ProductTreeController implements IProductTreeController {
  constructor(private readonly productTreeRepository: IProductTreeRepository) {}

  async getByParentId(parentId: string): Promise<HttpResponse<ProductTree[]>> {
    const result = await this.productTreeRepository.findById(parentId);

    return toHttpResponse(result);
  }

  async createProductTree(
    products: ProductTree[],
  ): Promise<HttpResponse<ProductTree[]>> {
    const parentId = products[0]?.parentId;

    if (!products.every((p) => p.parentId === parentId)) {
      return {
        statusCode: 400,
        body: { error: "Todos os filhos devem ter o mesmo produto pai" },
      };
    }

    const result = await this.productTreeRepository.create(products);

    return toHttpResponse(result, 201);
  }

  async replaceProductTree(
    parentId: string,
    products: ProductTree[],
  ): Promise<HttpResponse<ProductTree[]>> {
    if (!products.every((p) => p.parentId === parentId)) {
      return {
        statusCode: 400,
        body: { error: "Todos os filhos devem ter o mesmo produto pai" },
      };
    }

    const result = await this.productTreeRepository.replace(parentId, products);

    return toHttpResponse(result);
  }
}
