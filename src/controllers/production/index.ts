import { Production } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { CreateProductionDTO, IProductionController, IProductionRepository, UpdateProductionDTO } from "./interfaces";

export class ProductionController implements IProductionController {

    constructor(private readonly productionRepository: IProductionRepository){}

    async findAllProductions(): Promise<HttpResponse<Production[]>> {
        const result = await this.productionRepository.findAll()

        return toHttpResponse(result)
    }

    async findProductionById(id: number): Promise<HttpResponse<Production | null>> {
        const result = await this.productionRepository.findById(id)

        return toHttpResponse(result)
    }

    async createProduction(production: CreateProductionDTO): Promise<HttpResponse<void>> {
        const result = await this.productionRepository.create(production)

        return toHttpResponse(result)
    }

    async updateProduction(id: number, production: UpdateProductionDTO): Promise<HttpResponse<void>> {
        const result = await this.productionRepository.update(id, production)

        return toHttpResponse(result)
    }

}