import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { Purchase } from "../../models/purchase";


export interface IPurchaseRepository {
    findAll(): Promise<Result<Purchase[]>>
    findById(id: number): Promise<Result<Purchase | null>>
    create(purchase: Omit<Purchase, "id">): Promise<Result<Purchase>>
    update(id: number, purchase: Partial<Purchase>): Promise<Result<Purchase>>
}

export interface IPurchaseController {
    getAllPurchases(): Promise<HttpResponse<Purchase[]>>
    getPurchaseById(id: number): Promise<HttpResponse<Purchase | null>>
    createPurchase(purchase: Omit<Purchase, "id">): Promise<HttpResponse<Purchase>>
    updatePurchase(id: number, purchase: Partial<Purchase>): Promise<HttpResponse<Purchase>>
    cancelPurchase(id: number): Promise<HttpResponse<void>>
}