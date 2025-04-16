import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";import helmet from "helmet";

import prisma from "./lib/prisma.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

app.use(helmet()); // Protects against XSS, clickjacking, etc.
app.use(cookieParser()); // If a client sends a request with cookies (like a token stored in a cookie), you can easily access it in your route handlers:
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(cors({ origin: ORIGIN, credentials: true })); // Enable CORS for all routes and allow credentials (cookies, authorization headers, etc.) to be sent

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
  next();
};
// Global rate limiter (applies to all requests)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

prisma.$use(async (params, next) => {
  console.log(`Query: ${params.model}.${params.action}`);
  return next(params);
});

// application level middleware
app.use(LoggerMiddleware);
app.use(globalLimiter); // Apply to all routes

// routes
app.use("/api/users", authRoutes);

// error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
