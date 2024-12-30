import { Router } from "express";
import userRouter from "./controllers/userController.js";
import postRouter from "./controllers/postController.js";
import commentsController from "./controllers/commentsController.js";

let api = Router();

api.use("/users", userRouter);
api.use("/posts", postRouter);
api.use("/comments", commentsController);

export default api;
