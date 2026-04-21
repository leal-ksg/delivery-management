import { Prisma, ProductTree } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";

export interface ProductTreeDTO extends ProductTree {
  parentId: string;
  childId: string;
  childQuantity: number;
  childUnitCost: Prisma.Decimal;
  parent: { id: string; name: string; active: boolean };
  child: { id: string; name: string; active: boolean };
}

export interface IProductTreeRepository {
  findById(parentId: string): Promise<Result<ProductTreeDTO[]>>;
  create(products: ProductTree[]): Promise<Result<ProductTree[]>>;
  replace(
    parentId: string,
    products: ProductTree[],
  ): Promise<Result<ProductTree[]>>;
}

export interface IProductTreeController {
  getByParentId(parentId: string): Promise<HttpResponse<ProductTree[]>>;
  createProductTree(
    products: ProductTree[],
  ): Promise<HttpResponse<ProductTree[]>>;
  replaceProductTree(
    parentId: string,
    products: ProductTree[],
  ): Promise<HttpResponse<ProductTree[]>>;
}
