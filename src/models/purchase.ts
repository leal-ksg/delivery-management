import { PurchaseStatus } from "../../generated/prisma";
import { Prisma } from "../../generated/prisma/client";

export interface Purchase {
    id               : number,
  createdAt        : Date,
  userId           : string,
  status           : PurchaseStatus,   
  totalAmount      : Prisma.Decimal
}