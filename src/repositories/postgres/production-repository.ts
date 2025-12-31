import { Production } from "../../../generated/prisma";
import { CreateProductionDTO, IProductionRepository, UpdateProductionDTO } from "../../controllers/production/interfaces";
import { parseDatabaseErrorMessage } from "../../core/parse-database-error-message";
import { Result } from "../../core/result";
import { prisma } from "../../database/prisma";

export class ProductionRepository implements IProductionRepository {
  async findById(id: number): Promise<Result<Production | null>> {
    try {
      const production = await prisma.production.findUnique({ where: { id } });

      return { ok: true, body: production };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produção") };
    }
  }

  async findAll(): Promise<Result<Production[]>> {
    try {
      const productions = await prisma.production.findMany();

      return { ok: true, body: productions };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produção") };
    }
  }

  async create(production: CreateProductionDTO): Promise<Result<void>> {
    try {
      await prisma.production.create({ data: production });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produção") };
    }
  }

  async update(id: number, production: UpdateProductionDTO): Promise<Result<void>> {
    try {
      await prisma.production.update({ data: production, where: {id} });

      return { ok: true, body: undefined };
    } catch (err) {
      return { ok: false, error: parseDatabaseErrorMessage(err, "Produção") };
    }
  }
}
