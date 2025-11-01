import { Router } from "express";
import { userRouter } from "./user";
import { customerRouter } from "./customer";

export const router = Router()

router.use('/users', userRouter)
router.use('/customers', customerRouter)