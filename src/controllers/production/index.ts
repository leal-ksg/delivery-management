import { Production } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { ProductionService } from "../../services/production-service";
import { IProductRepository } from "../product/interfaces";
import {
  CreateProductionDTO,
  IProductionController,
  IProductionRepository,
  IProductionService,
  UpdateProductionDTO,
} from "./interfaces";

export class ProductionController implements IProductionController {
  private readonly service: IProductionService;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly productionRepository: IProductionRepository
  ) {
    this.service = new ProductionService(
      productRepository,
      productionRepository
    );
  }

  async getAllProductions(): Promise<HttpResponse<Production[]>> {
    const result = await this.productionRepository.findAll();

    return toHttpResponse(result);
  }

  async getProductionById(
    id: number
  ): Promise<HttpResponse<Production | null>> {
    const result = await this.productionRepository.findById(id);

    return toHttpResponse(result);
  }

  async createProduction(
    production: CreateProductionDTO
  ): Promise<HttpResponse<void>> {
    const result = await this.service.create(production);

    return toHttpResponse(result);
  }

  async updateProduction(
    id: number,
    production: UpdateProductionDTO
  ): Promise<HttpResponse<void>> {
    const result = await this.productionRepository.update(id, production);

    return toHttpResponse(result);
  }
}
