import { Router } from "express";
import prisma from "../prisma/pClient.js";
import bcrypt from "bcrypt";

let postRouter = Router();

// GET
// Get all posts
postRouter.get("/", async (_req, res) => {
  try {
    let posts = await prisma.post.findMany({
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when fetching posts.",
      error: error,
    });
  }
});

// Get post by id
postRouter.get("/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);
  try {
    let post = await prisma.post.findUnique({
      where: { id: postId },
      include: { comments: true, tags: true },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when fetching post ${postId}.`,
      error: error,
    });
  }
});

// POST
postRouter.post("/", async (req, res) => {
  let { title, content, authorId } = req.body;
  try {
    let post = await prisma.post.create({
      data: { title, content, authorId },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "There was an error when creating a post.",
      error: error,
    });
  }
});

// PUT
// Update post title, content
postRouter.put("/", async (req, res) => {
  const { id, title, content } = req.body;
  try {
    let updatedPost = null;

    if (title && content) {
      updatedPost = await prisma.post.update({
        where: { id },
        data: { title, content },
      });
    } else if (title) {
      updatedPost = await prisma.post.update({
        where: { id },
        data: { title },
      });
    } else {
      updatedPost = await prisma.post.update({
        where: { id },
        data: { content },
      });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when updating post ${id}.`,
      error: error,
    });
  }
});

// Toggle isPublished status
postRouter.put("/published-status/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId);
  try {
    let post = await prisma.post.findUnique({ where: { id: postId } });
    let updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isPublished: !post.isPublished },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when trying to updated the published status of post ${postId}.`,
    });
  }
});

// DELETE
// Delete by id
postRouter.delete("/:postId", async (req, res) => {
  let postId = parseInt(req.params.postId);
  try {
    let deletedPost = await prisma.post.delete({ where: { id: postId } });
    res.json(deletedPost);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when deleting post ${postId}.`,
      error: error,
    });
  }
});

// Delete all posts
postRouter.delete("/", async (req, res) => {
  try {
    let posts = await prisma.post.deleteMany({});
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "There was a problem when trying to delete all posts.",
      error: error,
    });
  }
});

export default postRouter;
