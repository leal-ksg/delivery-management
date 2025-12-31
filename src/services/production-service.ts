import { IProductRepository } from "../controllers/product/interfaces";
import {
  CreateProductionDTO,
  IProductionService,
  UpdateProductionDTO,
} from "../controllers/production/interfaces";
import { ValidationResult } from "../core/result";

export class ProductionService implements IProductionService {
  constructor(private readonly productRepository: IProductRepository) {}

  async validate(
    production: CreateProductionDTO | UpdateProductionDTO
  ): Promise<ValidationResult> {
    if (production.productId) {
      const productResult = await this.productRepository.findById(
        production.productId
      );

      if (!productResult.ok)
        return { succeed: false, message: productResult.error };

      if (!productResult.body)
        return { succeed: false, message: "Este produto não existe" };
    }

    if ("date" in production && production.date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0);

      const productionDate = new Date(production.date)
      productionDate.setHours(0, 0, 0, 0);

      if (productionDate > today)
        return {
          succeed: false,
          message: "A data de produção não pode ser posterior ao dia de hoje",
        };
    }

    return { succeed: true, message: null };
  }
}
