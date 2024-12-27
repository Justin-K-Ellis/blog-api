import { Router } from "express";
import { router as userRouter } from "./controllers/userController.js";

let api = Router();

api.use("/users", userRouter);

export default api;
