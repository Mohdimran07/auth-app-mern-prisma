import express from "express";
import rateLimit from "express-rate-limit";
import {
  forgetPassword,
  login,
  logout,
  register,
  verifyEmail,
  resetPassword,
  checkAuth,
} from "../controllers/authControllers.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 5 login attempts per IP per 15 mins
  message: "Too many login attempts, please try again later.",
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts. Account temporarily locked.",
    });
  },
});

router.get("/check-auth", protect, checkAuth);

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
