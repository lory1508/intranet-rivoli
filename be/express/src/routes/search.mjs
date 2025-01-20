import { Router } from 'express'
import db from '../../db/conn.mjs';

const router = Router()

// Search API Endpoint
router.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const regex = new RegExp(query, 'i'); // Case-insensitive substring matching

    let userCollection = await db.collection('users');
    let departmentCollection = await db.collection('departments');
    let officeCollection = await db.collection('offices');
    let serviceCollection = await db.collection('services');

    // Perform searches on each collection
    const [users, departments, offices, services] = await Promise.all([
      userCollection.aggregate([
        {
          $match: { 
            $or: [
              { firstname: regex }, 
              { lastname: regex }, 
              {phone: regex}, 
              {email: regex}, 
              {room: regex}
            ] 
          },
        },
        {
          $lookup: {
            from: 'departments', // Join with the departments collection
            localField: 'department_id', // Field in office documents
            foreignField: '_id', // Field in departments documents
            as: 'department_info', // Output array field
          },
        },
        {
          $lookup: {
            from: 'services', // Join with the services collection
            localField: 'service_id', // Field in office documents
            foreignField: '_id', // Field in services documents
            as: 'service_info', // Output array field
          },
        },
        {
          $lookup: {
            from: 'offices', // Join with the services collection
            localField: 'office_id', // Field in office documents
            foreignField: '_id', // Field in services documents
            as: 'office_info', // Output array field
          },
        },
      ]).toArray(),
      departmentCollection.find({ name: regex }).toArray(),
      officeCollection.aggregate([
        {
          $match: {
            name: regex, // Match the office name using the regex
          },
        },
        {
          $lookup: {
            from: 'departments', // Join with the departments collection
            localField: 'department_id', // Field in office documents
            foreignField: '_id', // Field in departments documents
            as: 'department_info', // Output array field
          },
        },
        {
          $lookup: {
            from: 'services', // Join with the services collection
            localField: 'service_id', // Field in office documents
            foreignField: '_id', // Field in services documents
            as: 'service_info', // Output array field
          },
        },
      ]).toArray(),
      serviceCollection.aggregate([
        {
          $match: {
            name: regex, // Match the office name using the regex
          },
        },
        {
          $lookup: {
            from: 'departments', // Join with the departments collection
            localField: 'department_id', // Field in office documents
            foreignField: '_id', // Field in departments documents
            as: 'department_info', // Output array field
          },
        },
      ]).toArray(),
    ]);

    // Combine results into one response
    res.json({
      users,
      departments,
      offices,
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during search.', details: error.message });
  }
});

export default router
