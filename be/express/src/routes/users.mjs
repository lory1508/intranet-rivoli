import { Router } from 'express'
import { validationResult, checkSchema, matchedData } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

const router = Router()
const COLLECTION = "users"

/**
 * Get users
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
      },
      {
        $lookup: {
          from: 'services',
          localField: "service_id",
          foreignField: "_id",
          as: "service_info"
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
 * Create user
 */
router.post(
  `/api/${COLLECTION}/`, 
  checkSchema(createUserValidationSchema), 
  async (req, res) => {
    const validationRes = validationResult(req)
    
    const result2 = validationRes.formatWith(error => error.msg);
    const errors2 = result2.array();

    if(!validationRes.isEmpty())
      return res.status(400).send(errors2)

    let collection = await db.collection(COLLECTION);
    const newDocument = matchedData(req)
    console.log(newDocument)
    newDocument.department_id = new BSON.ObjectId(newDocument.department_id)

    if(newDocument?.service_id)
      newDocument.service_id = new BSON.ObjectId(newDocument.service_id)

    newDocument.created_at = new Date();
    let result = await collection.insertOne(newDocument);
    return res.send(result).status(204);
  }
);

/**
 * Get user by ID
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
 * Update user
 */
router.patch(`/api/${COLLECTION}/:id`, async (req, res) => {
  const query = { _id: new BSON.ObjectId(req.params) };

  let manipulatedBody = { ...req.body }
  manipulatedBody.department_id = new BSON.ObjectId(req.body.department_id)
  if(manipulatedBody?.service_id)
    manipulatedBody.service_id = new BSON.ObjectId(req.body.service_id)
  manipulatedBody.updated_at = new Date()

  const updates = {
    $set: { 
      ...manipulatedBody,
    }
  };
  let collection = await db.collection(COLLECTION);
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});

/**
 * Delete user
 */
router.delete(`/api/${COLLECTION}/:id`, async (req, res) => {
  const query = { _id: new BSON.ObjectId(req.params.id) };
  const collection = db.collection(COLLECTION);
  let result = await collection.deleteOne(query);
  return res.send(result).status(200);
});     

export default router