import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { CreatePurchaseDTO, Purchase } from "../../models/purchase";
import { PurchaseService } from "../../services/purchase-service";
import { IStockRepository } from "../stock/interfaces";
import { IUserRepository } from "../user/interfaces";
import {
  IPurchaseController,
  IPurchaseProductRepository,
  IPurchaseRepository,
  IPurchaseService,
} from "./interfaces";

export class PurchaseController implements IPurchaseController {
  private readonly _purchaseService: IPurchaseService;

  constructor(
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly userRepository: IUserRepository,
    private readonly purchaseProductRepository: IPurchaseProductRepository,
    private readonly stockRepository: IStockRepository
  ) {
    this._purchaseService = new PurchaseService(
      userRepository,
      purchaseRepository,
      purchaseProductRepository,
      stockRepository
    );
  }

  async getAllPurchases(): Promise<HttpResponse<Purchase[]>> {
    const result = await this.purchaseRepository.findAll();

    return toHttpResponse(result);
  }

  async getPurchaseById(id: number): Promise<HttpResponse<Purchase | null>> {
    const result = await this.purchaseRepository.findById(id);

    return toHttpResponse(result);
  }

  async createPurchase(
    purchase: CreatePurchaseDTO
  ): Promise<HttpResponse<Purchase>> {
    const result = await this._purchaseService.createPurchase(purchase);

    return toHttpResponse(result);
  }

  async updatePurchase(
    id: number,
    purchase: Partial<Purchase>
  ): Promise<HttpResponse<Purchase>> {
    const result = await this._purchaseService.updatePurchase(id, purchase);

    return toHttpResponse(result);
  }

  async cancelPurchase(id: number): Promise<HttpResponse<Purchase>> {
    const result = await this._purchaseService.updatePurchase(id, {
      status: "CANCELLED",
    });

    return toHttpResponse(result);
  }
}