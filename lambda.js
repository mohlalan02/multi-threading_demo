import "dotenv/config";
import serverless from "serverless-http";
import app from "./app.js";
import { connectDb } from "./db.js";

let cachedHandler;

export async function handler(event, context) {
  if (!cachedHandler) {
    await connectDb();
    cachedHandler = serverless(app);
  }

  return cachedHandler(event, context);
}