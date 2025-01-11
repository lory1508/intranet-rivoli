import { Router } from 'express'
import { validationResult, checkSchema, matchedData } from 'express-validator';
import { createOfficeValidationSchema } from '../utils/validationSchemas.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

const router = Router()
const COLLECTION = "offices"

/**
 * Get offices
 */
router.get(
  `/api/${COLLECTION}`, 
  async (req, res) => {
    let collection = await db.collection(COLLECTION)  
    const {
      query: { filter, value },
    } = req;

    let results = await collection.aggregate([
      {
        $lookup: {
          from: 'departments',
          localField: "department_id",
          foreignField: "_id",
          as: "department_info"
        }
      }
    ]).toArray()
    
    // let results = await collection.find({}).toArray()
    return res.status(200).send(results);

    
    // .limit(50)
    
    // filter results
    // if (filter && value)
    //   return res.sendStatus(500)

  }
);

/**
 * Create office
 */
router.post(
  `/api/${COLLECTION}/`, 
  checkSchema(createOfficeValidationSchema), 
  async (req, res) => {
    const validationRes = validationResult(req)
    
    const result2 = validationRes.formatWith(error => error.msg);
    const errors2 = result2.array();

    if(!validationRes.isEmpty())
      return res.status(400).send(errors2)

    let collection = await db.collection(COLLECTION);
    const newDocument = matchedData(req)
    newDocument.department_id = new BSON.ObjectId(newDocument.department_id)
    newDocument.created_at = new Date();
    let result = await collection.insertOne(newDocument);
    return res.send(result).status(204);
  }
);

/**
 * Get office by ID
 */
router.get(`/api/${COLLECTION}/:id`, async (req, res) => {
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
 * Update office
 */
router.patch(`/api/${COLLECTION}/:id`, async (req, res) => {
  const query = { _id: new BSON.ObjectId(req.params) };
  const updates = {
    $set: { 
      ...req.body,
      department_id: new BSON.ObjectId(req.body.department_id),
      updated_at: new Date()
    }
  };
  let collection = await db.collection(COLLECTION);
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});

/**
 * Delete office
 */
router.delete(`/api/${COLLECTION}/:id`, async (req, res) => {
  const query = { _id: new BSON.ObjectId(req.params.id) };
  const collection = db.collection(COLLECTION);
  let result = await collection.deleteOne(query);
  return res.send(result).status(200);
});     

export default router