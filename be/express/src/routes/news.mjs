import { Router } from 'express'
import { query, validationResult, checkSchema, matchedData } from 'express-validator';
import { createNewsValidationSchema } from '../utils/validationSchemas.mjs';
import { BSON } from 'bson';
import db from '../../db/conn.mjs';

const router = Router()
const COLLECTION = "news"

/**
 * Get news
 */
router.get(
  `/api/${COLLECTION}`, 
  query('filter')
  .isString()
  .withMessage('Must be a string')
  .isLength({ min: 3, max: 10})
  .withMessage("Must be at least 3-10 characters"), 
  async (req, res) => {
    try {
      let collection = await db.collection(COLLECTION)  
      const {
        query: { filter, value },
      } = req;

      let results = await collection.aggregate([
        {
          $lookup: {
            from: 'newsCategories',
            localField: "category_id",
            foreignField: "_id",
            as: "category_info"
          }
        },
        {
          $lookup: {
            from: "newsTags",               // The collection to join
            localField: "tag_ids",            // Array field in `news`
            foreignField: "_id",           // Field in `newsTag` to match
            as: "tag_info"               // Output array containing matched documents
          }
        },
      ]).toArray()
      
      // filter results
      if (filter && value)
        return res.sendStatus(500)

      return res.status(200).send(results);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Create news
 */
router.post(
  `/api/${COLLECTION}/`, 
  checkSchema(createNewsValidationSchema), 
  async (req, res) => {
    try {
      const validationRes = validationResult(req)
      
      const result2 = validationRes.formatWith(error => error.msg);
      const errors2 = result2.array();

      if(!validationRes.isEmpty())
        return res.status(400).send(errors2)

      let collection = await db.collection(COLLECTION);
      const newDocument = matchedData(req)
      newDocument.created_at = new Date();
      if(newDocument.tag_ids)
        newDocument.tag_ids = newDocument.tag_ids.map(tag => new BSON.ObjectId(tag))

      if(newDocument.category_id)
        newDocument.category_id = new BSON.ObjectId(newDocument.category_id)
      
      let result = await collection.insertOne(newDocument);
      return res.send(result).status(204);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
);

/**
 * Get news by ID
 */
router.get(`/api/${COLLECTION}/:id`, async (req, res) => {
  // Get a single post
  try {
    let collection = await db.collection(COLLECTION);
    let query = {_id: new BSON.ObjectId(req.params.id)};
    let result = await collection.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'newsCategories',
          localField: "category_id",
          foreignField: "_id",
          as: "category_info"
        }
      },
      {
        $lookup: {
          from: "newsTags",               // The collection to join
          localField: "tag_ids",            // Array field in `news`
          foreignField: "_id",           // Field in `newsTag` to match
          as: "tag_info"               // Output array containing matched documents
        }
      },
    ]).toArray()

    if (!result || result.length === 0) {
      // If no result is found, return a 404
      return res.sendStatus(404);
    } else {
      // Return the first (and only) object from the result array
      return res.status(200).json(result[0]);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * Update news
 */
router.patch(`/api/${COLLECTION}/:id`, async (req, res) => {
  try {
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
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * Delete news
 */
router.delete(`/api/${COLLECTION}/:id`, async (req, res) => {
  try {
    const query = { _id: new BSON.ObjectId(req.params.id) };
    const collection = db.collection(COLLECTION);
    let result = await collection.deleteOne(query);
    return res.send(result).status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
});     

export default router