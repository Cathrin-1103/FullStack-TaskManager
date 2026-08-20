import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { setupSwagger } from "./swagger";
import { config } from "./config";

const app = express();
app.use(cors());
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


