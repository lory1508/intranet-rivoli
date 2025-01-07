import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";

const router = Router()

router.get('/api/products', (req, res) => {
  console.log(req.headers.cookie)
  console.log(req.cookies)
  if(req.cookies.hello && req.cookies.hello == "bitch")
    return res.send(mockProducts)

  return res.send({msg: "Sorry, you need the correct cookie"})
})

export default router