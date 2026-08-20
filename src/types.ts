import { Request } from "express";

export interface User {
  username: string;
  passwordHash: string;
}

export type UsersMap = Record<string, User>;

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export type TasksMap = Record<string, Task>;

export interface AuthPayload {
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}
