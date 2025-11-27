import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { Purchase } from "../../models/purchase";
import { IPurchaseController, IPurchaseRepository } from "./interfaces";

export class PurchaseController implements IPurchaseController {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async getAllPurchases(): Promise<HttpResponse<Purchase[]>> {
    const result = await this.purchaseRepository.findAll();

    return toHttpResponse(result);
  }

  async getPurchaseById(id: number): Promise<HttpResponse<Purchase | null>> {
    const result = await this.purchaseRepository.findById(id);

    return toHttpResponse(result);
  }

  async createPurchase(
    purchase: Omit<Purchase, "id">
  ): Promise<HttpResponse<Purchase>> {
    const result = await this.purchaseRepository.create(purchase);

    return toHttpResponse(result);
  }

  async updatePurchase(
    id: number,
    purchase: Partial<Purchase>
  ): Promise<HttpResponse<Purchase>> {
    const result = await this.purchaseRepository.update(id, purchase);

    return toHttpResponse(result);
  }

  async cancelPurchase(id: number): Promise<HttpResponse<Purchase>> {
    const result = await this.purchaseRepository.update(id, {
      status: "CANCELLED",
    });

    return toHttpResponse(result);
  }
}
