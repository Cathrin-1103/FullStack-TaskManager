import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { config } from "./config";
import { corsMiddleware } from "./config/cors";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(corsMiddleware);
app.use(express.json());

setupSwagger(app);

app.get("/", (req: Request, res: Response): void => {
  res.send("Task API is running!");
});

app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Swagger Docs available on http://localhost:${config.port}/api-docs`);
});
