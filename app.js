import express from "express";
import usersRouter from "./routes/users.js";
import healthRouter from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/users", usersRouter);

app.use(errorHandler);

export default app;