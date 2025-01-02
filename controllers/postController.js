import { Router } from "express";
import prisma from "../prisma/pClient.js";
import bcrypt from "bcrypt";
import tagRouter from "./tagController.js";

let postRouter = Router();

// GET
// Get all posts
postRouter.get("/", async (_req, res) => {
  try {
    let posts = await prisma.post.findMany({
      orderBy: [{ postedOn: "desc" }],
      include: {
        author: {
          select: { username: true },
        },
        _count: {
          select: { comments: true },
        },
        tags: true,
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
  console.log(req.body);
  let { title, content, authorId, tag } = req.body;
  try {
    if (tag) {
      let post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
          tags: {
            connect: [{ name: tag }],
          },
        },
      });
      res.json(post);
    } else {
      let post = await prisma.post.create({
        data: { title, content, authorId },
      });
      res.json(post);
    }
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

// (Update) add a tag
postRouter.put("/add-tag", async (req, res) => {
  let { postId, tag } = req.body;
  try {
    let updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        tags: {
          connect: [{ name: tag }],
        },
      },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when adding the tag "${tag}" to post ${postId}.`,
      error: error,
    });
  }
});

// Update (remove) a tag from a post.
postRouter.put("/remove-tag", async (req, res) => {
  let { postId, tag } = req.body;
  try {
    let updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        tags: {
          disconnect: [{ name: tag }],
        },
      },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when removing tag "${tag}" from post ${postId}.`,
      error: error,
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
