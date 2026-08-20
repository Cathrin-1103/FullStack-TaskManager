import { Router, Response, RequestHandler } from "express";
import { Task, AuthenticatedRequest } from "../types";
import { readTasks, saveTasks, getNextTaskId } from "../data/taskStore";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth as RequestHandler);

router.get("/", (req: AuthenticatedRequest, res: Response): void => {
  res.json(readTasks());
});

router.post("/", (req: AuthenticatedRequest, res: Response): void => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ message: "Title required" });
    return;
  }

  const tasks = readTasks();
  const taskId = getNextTaskId(tasks);
  const newTask: Task = { id: taskId, title, done: false };


  tasks[taskId] = newTask;
  saveTasks(tasks);

  res.status(201).json(newTask);
});

router.put("/:id", (req: AuthenticatedRequest, res: Response): void => {
  const taskId = req.params.id;
  const tasks = readTasks();
  const task = tasks[taskId];

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = req.body.done;

  saveTasks(tasks);
  res.json(task);
});

router.delete("/:id", (req: AuthenticatedRequest, res: Response): void => {
  const taskId = req.params.id;
  const tasks = readTasks();

  if (!tasks[taskId]) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  delete tasks[taskId];
  saveTasks(tasks);

  res.json({ message: "Task deleted successfully" });
});

export default router;
