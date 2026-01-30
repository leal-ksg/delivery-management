import { Production } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result, ValidationResult } from "../../core/result";

export type CreateProductionDTO = Omit<Production, "id" | "date">;

export type UpdateProductionDTO = Partial<Omit<Production, "id">>;

export interface IProductionController {
    getAllProductions(): Promise<HttpResponse<Production[]>>
    getProductionById(id: number): Promise<HttpResponse<Production  | null>>
    createProduction(production: CreateProductionDTO): Promise<HttpResponse<void>>
    updateProduction(id: number, production: UpdateProductionDTO): Promise<HttpResponse<void>>
}

export interface IProductionRepository {
  findById(id: number): Promise<Result<Production | null>>;
  findAll(): Promise<Result<Production[]>>;
  create(production: CreateProductionDTO): Promise<Result<void>>;
  update(id: number, production: UpdateProductionDTO): Promise<Result<void>>;
}

export interface IProductionService {
  validate(production: CreateProductionDTO | UpdateProductionDTO): Promise<ValidationResult>;
  create(production: CreateProductionDTO): Promise<Result<void>>
  update(id: number, production: UpdateProductionDTO): Promise<Result<void>>
}