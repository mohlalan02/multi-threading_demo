import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = 3000;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

const client = new MongoClient(mongoUri);

async function startServer() {
  await client.connect();

  const db = client.db(databaseName);
  const users = db.collection("users");

  app.get("/users", async (req, res) => {
    const result = await users.find().toArray();
    res.json(result);
  });

  app.get("/users/:id", async (req, res) => {
    const user = await users.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });

  app.post("/users", async (req, res) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      createdAt: new Date().toISOString()
    };

    const result = await users.insertOne(newUser);

    res.status(201).json({
      _id: result.insertedId,
      ...newUser
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
});