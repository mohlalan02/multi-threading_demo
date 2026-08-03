import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./db.js";

const port = process.env.PORT || 3000;

async function startServer() {
  await connectDb();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
});