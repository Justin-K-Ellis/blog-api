import { Router } from "express";
import prisma from "../prisma/pClient.js";
import bcrypt from "bcrypt";

let router = Router();

// GET
// Get all users
router.get("/", async (_req, res) => {
  try {
    let users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        registeredOn: true,
        isAdmin: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when fetching all users.",
      error: error,
    });
  }
});

// Get user by id
router.get("/:userId", async (req, res) => {
  let userId = parseInt(req.params.userId);
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        registeredOn: true,
        isAdmin: true,
        posts: true,
        comments: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when fetching user ${userId}.`,
      error: error,
    });
  }
});

// POST
router.post("/", async (req, res) => {
  let { username, email, password, isAdmin } = req.body;
  console.log(password);
  let salt = 10;
  try {
    let hashedPassword = await bcrypt.hash(password, salt);
    let user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when posting a user.",
      error: error,
    });
  }
});

// PUT
// Update username by id
router.put("/username", async (req, res) => {
  let { id, username } = req.body;
  try {
    let updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when updating the username.",
      error: error,
    });
  }
});

// Update email by id
router.put("/email", async (req, res) => {
  let { id, email } = req.body;
  try {
    let updatedUser = await prisma.user.update({
      where: { id },
      data: { email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when updating the email.",
      error: error,
    });
  }
});

// Update user password by id
router.put("/password", async (req, res) => {
  let { id, password } = req.body;
  let salt = 10;
  try {
    let encyptedPassword = await bcrypt.hash(password, salt);
    let updatedUser = await prisma.user.update({
      where: { id },
      data: { password: encyptedPassword },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when updating the password.",
      error: error,
    });
  }
});

// DELETE
// Delete by id
router.delete("/:userId", async (req, res) => {
  let userId = parseInt(req.params.userId);
  try {
    let deletedUser = await prisma.user.delete({ where: { id: userId } });
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when deleting user ${userId}.`,
      error: error,
    });
  }
});

// Delete all users
router.delete("/", async (req, res) => {
  try {
    let users = await prisma.user.deleteMany({});
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when deleting all users.",
    });
  }
});

export { router };
