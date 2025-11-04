import { Order } from "../../../generated/prisma";
import { Result } from "../../core/result";
import { CreateOrderDTO } from "../../models/order";

export interface IOrderService {
    validate(newOrder: CreateOrderDTO): Promise<{succeed: boolean, message: string | null}>;
    createOrder(newOrder: CreateOrderDTO): Result<Order | null>;
}