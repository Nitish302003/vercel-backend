require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// Example: mongodb+srv://ninoaugusj:<db_password>@cluster0.m5jihpm.mongodb.net/
const client = new MongoClient(uri);
let jobsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('job_management');
  jobsCollection = db.collection('jobs');
}
connectDB();

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  const jobs = await jobsCollection.find().sort({ created_at: -1 }).toArray();
  res.json(jobs);
});

// Create a new job
app.post('/api/jobs', async (req, res) => {
  const job = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const result = await jobsCollection.insertOne(job);
  res.status(201).json({ ...job, _id: result.insertedId });
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));