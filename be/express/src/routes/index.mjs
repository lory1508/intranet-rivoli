import { Router } from "express";
import usersRouter from './users.mjs'
import productsRouter from './products.mjs'
import departmentsRouter from './departments.mjs'

const router = Router()

router.use(usersRouter)
router.use(productsRouter)
router.use(departmentsRouter)

export default router