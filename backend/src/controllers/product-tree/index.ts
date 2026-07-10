import { ProductTree } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";

import {
  DeleteProductTreeDTO,
  IProductTreeController,
  IProductTreeRepository,
  ProductTreeDTO,
} from "./interfaces";

export class ProductTreeController implements IProductTreeController {
  constructor(private readonly productTreeRepository: IProductTreeRepository) {}
  async getByParentId(
    parentId: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<ProductTreeDTO>>> {
    const result = await this.productTreeRepository.findByParentId(
      parentId,
      itemsPerPage,
      page,
    );

    return toHttpResponse(result);
  }

  async createNodes(products: ProductTree[]): Promise<HttpResponse<void>> {
    const result = await this.productTreeRepository.create(products);

    return toHttpResponse(result, 201);
  }

  async updateNode(product: ProductTree): Promise<HttpResponse<ProductTree>> {
    const result = await this.productTreeRepository.update(product);

    return toHttpResponse(result);
  }

  async deleteNodes(
    products: DeleteProductTreeDTO[],
  ): Promise<HttpResponse<void>> {
    const result = await this.productTreeRepository.delete(products);

    return toHttpResponse(result);
  }
}
