import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description: "RESTful Task Management API with JWT Authentication",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "1" },

          title: { type: "string", example: "Complete task API implementation" },
          done: { type: "boolean", example: false },
        },
        required: ["id", "title", "done"],
      },
      RegisterInput: {
        type: "object",
        properties: {
          username: { type: "string", example: "johndoe" },
          password: { type: "string", example: "securepassword123" },
        },
        required: ["username", "password"],
      },
      LoginInput: {
        type: "object",
        properties: {
          username: { type: "string", example: "johndoe" },
          password: { type: "string", example: "securepassword123" },
        },
        required: ["username", "password"],
      },
      CreateTaskInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Buy groceries" },
        },
        required: ["title"],
      },
      UpdateTaskInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "Buy organic groceries" },
          done: { type: "boolean", example: true },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operation completed successfully" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "API Health Check",
        description: "Check if the Task API service is running.",
        responses: {
          200: {
            description: "API is running",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  example: "Task API is running!",
                },
              },
            },
          },
        },
      },
    },
    "/register": {
      post: {
        summary: "Register user",
        description: "Register a new user with a username and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          400: {
            description: "Validation error or user already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        summary: "Login user",
        description: "Authenticate user credentials and receive a JWT Bearer token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Authentication successful, returns JWT token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TokenResponse",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        summary: "Get all tasks",
        description: "Retrieve all stored tasks. Requires JWT Bearer authentication token.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dictionary of tasks mapped by ID",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Token missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new task",
        description: "Create a task with a title. Requires JWT Bearer authentication token.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
          400: {
            description: "Title is required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Token missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
    "/tasks/{id}": {
      put: {
        summary: "Update task by ID",
        description: "Update title or completion status of a task. Requires JWT Bearer authentication token.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Task ID",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTaskInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task",
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Token missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete task by ID",
        description: "Delete an existing task by ID. Requires JWT Bearer authentication token.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Task ID",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Task deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          404: {
            description: "Task not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Token missing or invalid",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MessageResponse",
                },
              },
            },
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
