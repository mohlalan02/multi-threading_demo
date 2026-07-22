import "dotenv/config";
import express from "express";
import { connectDb } from "./db.js";
import usersRouter from "./routes/users.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", usersRouter);

async function startServer() {
  await connectDb();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
});