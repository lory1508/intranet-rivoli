import { Router } from "express";

const router = Router()

router.get('/api/products', (req, res) => {
  try {
    if(req.cookies.hello && req.cookies.hello == "bitch")
      return res.sendStatus(500)
    
    return res.send({msg: "Sorry, you need the correct cookie"})
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
})

export default router