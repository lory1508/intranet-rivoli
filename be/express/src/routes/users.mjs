import { Router } from 'express'
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

// mock data
import { mockUsers } from '../utils/constants.mjs';

const router = Router()
const COLLECTION = "users"

/**
 * Get users
 */
router.get(
  "/api/users", 
  query('filter')
  .isString()
  .withMessage('Must be a string')
  .isLength({ min: 3, max: 10})
  .withMessage("Must be at least 3-10 characters"), 
  async (req, res) => {
    let collection = await db.collection(COLLECTION)  
    const {
      query: { filter, value },
    } = req;

    let results = await collection.find({}).toArray()
    // .limit(50)
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));

    return res.status(200).send(results);
  }
);

/**
 * Create user
 */
router.post(
  "/api/users/", 
  checkSchema(createUserValidationSchema), 
  async (req, res) => {
    const validation = validationResult(req)
    
    if(!validation.isEmpty())
      return res.status(400).send({errors: result.array()})

    let collection = await db.collection(COLLECTION);
    const newDocument = matchedData(req)
    // let newDocument = req.body;
    newDocument.created_at = new Date();
    let result = await collection.insertOne(newDocument);
    return res.send(result).status(204);
  }
);

/**
 * Get user by ID
 */
router.get("/api/users/:id", async (req, res) => {
  // Get a single post
  let collection = await db.collection(COLLECTION);
  let query = {_id: new BSON.ObjectId(req.params.id)};
  let result = await collection.findOne(query);
  
  if (!result) 
    return res.sendStatus(404);
  else 
    return res.send(result).status(200);
});

/**
 * Update user
 */
router.patch("/api/users/:id", async (req, res) => {
  const query = { _id: new BSON.ObjectId(req.params.id) };
  const updates = {
    $set: { 
      ...req.body,
      updated_at: new Date()
    }
  };
  let collection = await db.collection(COLLECTION);
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});

/**
 * Delete user
 */
router.delete("/api/users/:id", resolveIndexByUserId, async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const collection = db.collection(COLLECTION);
  let result = await collection.deleteOne(query);
  return res.send(result).status(200);
});     

export default router