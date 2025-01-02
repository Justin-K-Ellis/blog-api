import "dotenv/config";
import { Router } from "express";
import prisma from "../prisma/pClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

let loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json(`User with ${email} not found.`);
    }

    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json("Password incorrect.");
    }

    let payload = {
      username: user.username,
      email: user.email,
      registeredOn: user.registeredOn,
      isAdmin: user.isAdmin,
    };

    let token = jwt.sign(payload, process.env.SECRET);
    token = "Bearer " + token;

    res.json(token);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when logging in with ${email}.`,
      error: error,
    });
  }
});

export default loginRouter;
