import { Router } from 'express'
import { validationResult, checkSchema, matchedData } from 'express-validator';
import { createServiceValidationSchema } from '../utils/validationSchemas.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

const router = Router()
const COLLECTION = "services"

/**
 * Get services
 */
router.get(
  `/api/${COLLECTION}`, 
  async (req, res) => {
    try {
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
      
      if( filter && value ) {
        results = results.filter(office => {
          const stringifiedFilter = JSON.stringify(office[filter])
          const stringifiedValue = JSON.stringify(value)
          return stringifiedFilter == stringifiedValue
        })
      }
      return res.status(200).send(results);
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  }
);

/**
 * Create service
 */
router.post(
  `/api/${COLLECTION}/`, 
  checkSchema(createServiceValidationSchema), 
  async (req, res) => {
    try {
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
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  }
);

/**
 * Get service by ID
 */
router.get(`/api/${COLLECTION}/:id`, async (req, res) => {
  try {
    // Get a single post
    let collection = await db.collection(COLLECTION);
    let query = {_id: new BSON.ObjectId(req.params.id)};
    let result = await collection.findOne(query);
    
    if (!result) 
      return res.sendStatus(404);
    else 
    return res.send(result).status(200);
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
});

/**
 * Update service
 */
router.patch(`/api/${COLLECTION}/:id`, async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
});

/**
 * Delete service
 */
router.delete(`/api/${COLLECTION}/:id`, async (req, res) => {
  try {
    const query = { _id: new BSON.ObjectId(req.params.id) };
    const collection = db.collection(COLLECTION);
    let result = await collection.deleteOne(query);
    return res.send(result).status(200);
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
});     

export default router