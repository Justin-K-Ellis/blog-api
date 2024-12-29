import { Router } from "express";
import userRouter from "./controllers/userController.js";
import postRouter from "./controllers/postController.js";

let api = Router();

api.use("/users", userRouter);
api.use("/posts", postRouter);

export default api;
