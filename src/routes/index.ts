import { Router } from "express";
import { userRouter } from "./user";
import { customerRouter } from "./customer";
import { orderRouter } from "./order";
import { productRouter } from "./product";

export const router = Router();

router.use("/users", userRouter);
router.use("/customers", customerRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
