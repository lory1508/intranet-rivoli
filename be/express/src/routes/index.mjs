import { Router } from "express";
import usersRouter from './users.mjs'
import productsRouter from './products.mjs'
import departmentsRouter from './departments.mjs'
import serviceRouter from './service.mjs'
import officeRouter from './office.mjs'

const router = Router()

router.use(usersRouter)
router.use(productsRouter)
router.use(departmentsRouter)
router.use(serviceRouter)
router.use(officeRouter)

export default router