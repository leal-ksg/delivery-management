import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { Stock } from "../../models/stock";
import { IStockController, IStockRepository } from "./interfaces";

export class StockController implements IStockController {
    constructor(private readonly stockRepository: IStockRepository){}

    async getAllProductsStock(): Promise<HttpResponse<Stock[]>> {
        const result = await this.stockRepository.findAll()

        return toHttpResponse(result)
    }

    async getProductStockById(productId: string): Promise<HttpResponse<Stock | null>> {
        const result = await this.stockRepository.findById(productId)

        return toHttpResponse(result)
    }

    async updateStock(data: Stock): Promise<HttpResponse<Stock>> {
        const result = await this.stockRepository.update(data)

        return toHttpResponse(result)
    }

}