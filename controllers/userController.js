import { Router } from "express";
import prisma from "../prisma/pClient.js";

let router = Router();

// GET
// Get user by id
router.get("/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    let user = await prisma.user.findUnique({ where: { id } });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when fetching user ${userId}.`,
      error: error,
    });
  }
});

export default router;
