const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const usersCollection = db.collection("admin");
    const skillsCollection = db.collection("skills");
    const projectCollection = db.collection("projects");
    const blogsCollection = db.collection("blogs");

    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        success: true,
        message: "Login successful",
        email: req.body.email,
      });
    });

    app.post("/api/v1/add-skill", async (req, res) => {
      const body = req.body;
      await skillsCollection.insertOne(body);
      res.status(201).json({
        success: true,
        message: "skill added successfully",
      });
    });

    app.get("/api/v1/skills", async (req, res) => {
      const result = await skillsCollection.find().toArray();
      res.send(result);
    });
    app.post("/api/v1/add-project", async (req, res) => {
      const body = req.body;
      await projectCollection.insertOne(body);
      res.status(201).json({
        success: true,
        message: "project added successfully",
      });
    });

    app.get("/api/v1/projects", async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
    });
    app.post("/api/v1/add-blog", async (req, res) => {
      const body = req.body;
      await blogsCollection.insertOne(body);
      res.status(201).json({
        success: true,
        message: "blog added successfully",
      });
    });

    app.get("/api/v1/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
