import { Prisma } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { Stock } from "../../models/stock";

export interface IStockRepository {
    findAll(): Promise<Result<Stock[]>>
    findById(productId: string): Promise<Result<Stock>>
    create(data: Stock, transaction: Prisma.TransactionClient): Promise<Result<Stock>>
    increase(data: Stock, transaction: Prisma.TransactionClient): Promise<Result<Stock>>
    decrease(data: Stock, transaction: Prisma.TransactionClient): Promise<Result<Stock>>
}

export interface IStockController {
    getAllProductsStock(): Promise<HttpResponse<Stock[]>>
    getProductStockById(productId: string): Promise<HttpResponse<Stock>>
    updateStock(data: Stock): Promise<HttpResponse<Stock>>
}