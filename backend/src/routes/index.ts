import { Router } from "express";
import { userRouter } from "./user";
import { customerRouter } from "./customer";
import { orderRouter } from "./order";
import { productRouter } from "./product";
import { purchaseRouter } from "./purchase";
import { productionRouter } from "./production";
import { productTreeRouter } from "./product-tree";

export const router = Router();

router.use("/user", userRouter);
router.use("/customer", customerRouter);
router.use("/order", orderRouter);
router.use("/product", productRouter);
router.use("/purchase", purchaseRouter);
router.use("/production", productionRouter);
router.use("/product-tree", productTreeRouter);
