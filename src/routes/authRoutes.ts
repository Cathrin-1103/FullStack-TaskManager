import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readUsers, saveUsers } from "../data/userStore";
import { config } from "../config";

const router = Router();

// POST /register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password required" });
    return;
  }

  const users = readUsers();
  if (users[username]) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users[username] = { username, passwordHash };
  saveUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// POST /login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users[username];

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  const token = jwt.sign(
    { username: user.username },
    config.jwtSecret,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

export default router;

