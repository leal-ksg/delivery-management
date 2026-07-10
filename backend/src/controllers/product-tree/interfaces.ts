import { ProductTree } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { Result } from "../../core/result";

export interface DeleteProductTreeDTO {
  parentId: string;
  childId: string;
}

export interface ProductTreeDTO extends ProductTree {
  parentId: string;
  childId: string;
  childQuantity: number;
  parent: { id: string; name: string; active: boolean };
  child: { id: string; name: string; active: boolean };
}

export interface IProductTreeRepository {
  findByParentId(
    parentId: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<ProductTreeDTO>>>;
  create(products: ProductTree[]): Promise<Result<void>>;
  update(product: ProductTree): Promise<Result<ProductTree>>;
  delete(products: DeleteProductTreeDTO[]): Promise<Result<void>>;
}

export interface IProductTreeController {
  getByParentId(
    parentId: string,
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<ProductTreeDTO>>>;
  createNodes(products: ProductTree[]): Promise<HttpResponse<void>>;
  updateNode(product: ProductTree): Promise<HttpResponse<ProductTree>>;
  deleteNodes(products: DeleteProductTreeDTO[]): Promise<HttpResponse<void>>;
}
