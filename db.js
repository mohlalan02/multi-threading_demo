import "dotenv/config";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI in .env");
}

if (!databaseName) {
  throw new Error("Missing DATABASE_NAME in .env");
}

const client = new MongoClient(mongoUri);
let db;

export async function connectDb() {
  if (!db) {
    await client.connect();
    db = client.db(databaseName);

    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true }
    );
  }

  return db;
}

export function getUsersCollection() {
  return db.collection("users");
}