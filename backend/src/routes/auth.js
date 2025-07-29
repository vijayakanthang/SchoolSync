const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Normal login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Google Login
router.post("/google", async (req, res) => {
  const { name, email, googleId } = req.body;

  if (!email || !googleId) {
    return res.status(400).json({ error: "Missing email or googleId" });
  }

  try {
    // Try to find user by googleId first
    let user = await prisma.user.findUnique({ where: { googleId } });

    // If not found, try by email
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (user) {
      // If user found but googleId not set, update it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      // Create new user with dummy password
      const dummyPassword = await bcrypt.hash("google_dummy_password", 10);

      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          password: dummyPassword,
          role: "student", // default role
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});

module.exports = router;
