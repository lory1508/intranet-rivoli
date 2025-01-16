import { Router } from "express";
import usersRouter from './users.mjs'
import productsRouter from './products.mjs'
import departmentsRouter from './departments.mjs'
import serviceRouter from './service.mjs'
import officeRouter from './office.mjs'
import uploadRouter from './upload.mjs'
import searchRouter from './search.mjs'
import newsRouter from './news.mjs'
import newsCategoryRouter from './newsCategory.mjs'
import newsTagRouter from './newsTag.mjs'

const router = Router()

router.use(usersRouter)
router.use(productsRouter)
router.use(departmentsRouter)
router.use(serviceRouter)
router.use(officeRouter)
router.use(uploadRouter)
router.use(searchRouter)
router.use(newsRouter)
router.use(newsCategoryRouter)
router.use(newsTagRouter)

export default router