import { Router } from 'express'
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';

// mock data
import { mockUsers } from '../utils/constants.mjs';

const router = Router()

router.get(
  "/api/users", 
  query('filter')
  .isString()
  .withMessage('Must be a string')
  .isLength({ min: 3, max: 10})
  .withMessage("Must be at least 3-10 characters"), 
  (req, res) => {
    const result = validationResult(req)
    console.log(result)
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.status(200).send(mockUsers);
  }
);

router.post(
  "/api/users/", 
  checkSchema(createUserValidationSchema), 
  (req, res) => {
    const result = validationResult(req)
    
    if(!result.isEmpty())
      return res.status(400).send({errors: result.array()})

    const data = matchedData(req)
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

router.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(204);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1)
  return res.sendStatus(200)
});     

export default router