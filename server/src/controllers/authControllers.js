import bcrypt from "bcryptjs";
import crypto from "crypto";
import asyncHandler from "../middlewares/asyncHandler.js";
import prisma from "../lib/prisma.js";
import generateToken from "../lib/generateToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mail-configs/emails.js";
import { error } from "console";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log({ username, email, password })
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes,
    },
  });
  // Create JWT token
  generateToken(user, res);

  await sendVerificationEmail(user.email, verificationToken);

  // Send response
  if (user) {
    res.status(201).json({
      error: false,
      message: "User Created Successfuly",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } else {
    res.status(400).json({ error: true, message: "User not created!" });
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ error: true, message: "Please fill all fields" });
    throw new Error("Please fill all fields");
  }
  // check if user exists or not
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    res.status(401).json({ error: true, message: "User not found" });
    throw new Error("User not found");
  }
  // check if password is correct or not
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).json({ error: true, message: "Invalid credentials" });
    throw new Error("Invalid credentials");
  }
  // Create JWT token
  generateToken(user, res);
  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Send response excluding the password
  const { password: excludedPassword, ...userDataWithoutPassword } = user;
  // Send response
  res.status(200).json({
    error: false,
    message: "Logged in Successful",
    data: userDataWithoutPassword,
  });
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ error: false, message: "Logout Successful" });
});

// @desc    Verify user email
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { pin } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: pin,
        verificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      res
        .status(400)
        .json({ error: true, message: "Invalid or expired verification code" });
    }
    // if exist, update user fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });
    // console.log("updatedUser: ", updatedUser);

    // send welcome email.
    await sendWelcomeEmail(updatedUser.username, updatedUser.email);
    const userWithoutPassword = { ...updatedUser };
    delete userWithoutPassword.password;

    res.status(200).json({
      error: false,
      message: "Email verified successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    console.log("Error at verifying email:", err);
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({ error: true, message: "Invalid email Id" });
      throw new Error("Invalid email Id");
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ error: true, message: "User not found" });
      throw new Error("User not found!");
    }
    console.log(user);

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresAt: resetTokenExpiresAt,
      },
    });

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      error: false,
      message: `Forget password sent to this email ${email}`,
      data: updatedUser,
    });
  } catch (err) {
    console.log(`error at forget password: ${err}`);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    res
      .status(400)
      .json({ error: true, message: "Invalid or expired reset token" });
    throw new Error("Invalid or expired reset token");
  }
  //if exists update password to hassed
  const hassedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hassedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    },
  });
  await sendResetSuccessEmail(user.email, user.username);
  res.status(201).json({
    error: false,
    message: "Password reset successful",
    data: updatedUser,
  });
});

const checkAuth = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        role: true,
        username: true,
      },
    });
    if (!user) {
      res.status(400).json({ error: true, message: "User not found!" });
      throw new Error("User not found!");
    }

    res.status(200).json({
      error: false,
      message: "User fetched successfully!",
      data: user,
    });
  } catch (err) {
    console.error("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export {
  register,
  login,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
  checkAuth,
};
