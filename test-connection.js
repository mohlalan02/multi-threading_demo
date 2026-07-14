import "dotenv/config";
import { MongoClient } from "mongodb";

const rawMongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

if (!rawMongoUri) {
  throw new Error("Missing MONGODB_URI in .env");
}

if (!databaseName) {
  throw new Error("Missing DATABASE_NAME in .env");
}

const mongoUri = rawMongoUri
  .trim()
  .replace(/^MONGODB_URI=/i, "")
  .replace(/^['\"]|['\"]$/g, "");

if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
  throw new Error(
    "Invalid MONGODB_URI format in .env. It must start with mongodb:// or mongodb+srv://"
  );
}

const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 5000
});

async function main() {
  try {
    await client.connect();

    const db = client.db(databaseName);
    const users = await db.collection("users").find().toArray();

    console.log("Connected to MongoDB Atlas");
    console.log(users);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  } finally {
    await client.close();
  }
}

main();