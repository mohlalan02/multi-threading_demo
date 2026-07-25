import "dotenv/config";
import express from "express";
import { connectDb } from "./db.js";
import usersRouter from "./routes/users.js";
import healthRouter from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/health", healthRouter);
app.use("/users", usersRouter);

app.use(errorHandler);

async function startServer() {
  await connectDb();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
});