import { Router } from "express";

const router = Router()

router.get('/api/products', (req, res) => {
  if(req.cookies.hello && req.cookies.hello == "bitch")
    return res.sendStatus(500)

  return res.send({msg: "Sorry, you need the correct cookie"})
})

export default router