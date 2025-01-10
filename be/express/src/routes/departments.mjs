import { Router } from 'express'
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { createDepartmentValidationSchema } from '../utils/validationSchemas.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

const router = Router()
const COLLECTION = "departments"

/**
 * Get departments
 */
router.get(
  `/api/${COLLECTION}`, 
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
    
    // filter results
    if (filter && value)
      return res.sendStatus(500)

    return res.status(200).send(results);
  }
);

/**
 * Create department
 */
router.post(
  `/api/${COLLECTION}/`, 
  checkSchema(createDepartmentValidationSchema), 
  async (req, res) => {
    const validationRes = validationResult(req)
    
    const result2 = validationRes.formatWith(error => error.msg);
    const errors2 = result2.array();

    if(!validationRes.isEmpty())
      return res.status(400).send(errors2)

    let collection = await db.collection(COLLECTION);
    const newDocument = matchedData(req)
    newDocument.created_at = new Date();
    let result = await collection.insertOne(newDocument);
    return res.send(result).status(204);
  }
);

/**
 * Get department by ID
 */
router.get(`/api/${COLLECTION}/:id`, async (req, res) => {
  // Get a single post
  let collection = await db.collection(COLLECTION);
  console.log('>>> get: ', req.params)
  let query = {_id: new BSON.ObjectId(req.params.id)};
  let result = await collection.findOne(query);
  
  if (!result) 
    return res.sendStatus(404);
  else 
    return res.send(result).status(200);
});

/**
 * Update department
 */
router.patch(`/api/${COLLECTION}/:id`, async (req, res) => {
  console.log('>>> patch: ', req.params)
  const query = { _id: new BSON.ObjectId(req.params) };
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
 * Delete department
 */
router.delete(`/api/${COLLECTION}/:id`, async (req, res) => {
  console.log('>>> delete: ', req.params)
  const query = { _id: new BSON.ObjectId(req.params.id) };
  const collection = db.collection(COLLECTION);
  let result = await collection.deleteOne(query);
  return res.send(result).status(200);
});     

export default router