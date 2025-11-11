import { Prisma } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { Stock } from "../../models/stock";

export interface IStockRepository {
    findAll(): Promise<Result<Stock[]>>
    findById(productId: string): Promise<Result<Stock | null>>
    create(data: Stock, transaction: Prisma.TransactionClient): Promise<Result<Stock>>
    update(data: Stock): Promise<Result<Stock>>
    delete(productId: string): Promise<Result<void>>
}

export interface IStockController {
    getAllProductsStock(): Promise<HttpResponse<Stock[]>>
    getProductStockById(productId: string): Promise<HttpResponse<Stock | null>>
    updateStock(data: Stock): Promise<HttpResponse<Stock>>
}