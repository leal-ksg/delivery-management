import { Prisma, ProductTree } from "../../../generated/prisma";
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
  childUnitCost: Prisma.Decimal;
  parent: { id: string; name: string; active: boolean };
  child: { id: string; name: string; active: boolean };
}

export interface IProductTreeRepository {
  findAll(
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<ProductTreeDTO>>>;
  findById(parentId: string): Promise<Result<ProductTreeDTO[]>>;
  create(product: ProductTree): Promise<Result<ProductTree>>;
  update(product: ProductTree): Promise<Result<ProductTree>>;
  delete(products: DeleteProductTreeDTO[]): Promise<Result<void>>;
}

export interface IProductTreeController {
  getAllNodes(
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<ProductTreeDTO>>>;
  getByParentId(parentId: string): Promise<HttpResponse<ProductTree[]>>;
  createNode(product: ProductTree): Promise<HttpResponse<ProductTree>>;
  updateNode(product: ProductTree): Promise<HttpResponse<ProductTree>>;
  deleteNodes(products: DeleteProductTreeDTO[]): Promise<HttpResponse<void>>;
}
