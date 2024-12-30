import { Router } from "express";
import prisma from "../prisma/pClient.js";
import bcrypt from "bcrypt";

let commentsController = Router();

// GET
// Get all comments for a post
commentsController.get("/post/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);
  try {
    let comments = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        comments: true,
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when fetching comments for post ${postId}.`,
      error: error,
    });
  }
});

// Get a specific comment
commentsController.get("/:commentId", async (req, res) => {
  let commentId = parseInt(req.params.commentId);
  try {
    let comment = await prisma.comment.findUnique({ where: { id: commentId } });
    res.json(comment);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when fetching comment ${commentId}.`,
    });
  }
});

// POST
commentsController.post("/", async (req, res) => {
  let { postId, content, authorId } = req.body;
  try {
    let comment = await prisma.comment.create({
      data: { content, authorId, postId },
    });
    res.json(comment);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when creating a comment for post ${postId}.`,
      error: error,
    });
  }
});

// PUT

// DELETE

export default commentsController;
