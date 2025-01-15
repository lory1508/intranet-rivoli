import { Router } from 'express'
import db from '../../db/conn.mjs';

const router = Router()

// Search API Endpoint
router.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const regex = new RegExp(query, 'i'); // Case-insensitive substring matching

  let userCollection = await db.collection('users');
  let departmentCollection = await db.collection('departments');
  let officeCollection = await db.collection('offices');
  let serviceCollection = await db.collection('services');

  try {
    // Perform searches on each collection
    const [users, departments, offices, services] = await Promise.all([
      userCollection.find({ $or: [{ firstname: regex }, { lastname: regex }, {phone: regex}, {email: regex}, {room: regex}] }).toArray(),
      departmentCollection.find({ name: regex }).toArray(),
      officeCollection.find({ name: regex }).toArray(),
      serviceCollection.find({ name: regex }).toArray(),
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
