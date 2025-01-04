import { Router } from "express";
import prisma from "../prisma/pClient.js";
import { expressjwt } from "express-jwt";
import { jwtExpressOpts } from "../utils/config.js";
import noAuthMessage from "../utils/noAuthMessage.js";

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

// auth test
postRouter.post("/test", expressjwt(jwtExpressOpts), (req, res) => {
  console.log(req.auth);
  if (req.auth && req.auth.isAdmin) {
    res.json({
      message: "go ahead an post, admin",
    });
  } else {
    res.json("no post only read");
  }
});

// Make a post
postRouter.post("/", expressjwt(jwtExpressOpts), async (req, res) => {
  let { title, content, authorId, tag } = req.body;
  if (req.auth && req.auth.isAdmin) {
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
  } else {
    res.status.json(noAuthMessage("create posts"));
  }
});

// PUT
// Update post title, content
postRouter.put("/", expressjwt(jwtExpressOpts), async (req, res) => {
  const { id, title, content } = req.body;
  if (req.auth && req.auth.isAdmin) {
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
  } else {
    res.status(401).json(noAuthMessage("update title and/or content of post"));
  }
});

// Toggle isPublished status
postRouter.put(
  "/published-status/:postId",
  expressjwt(jwtExpressOpts),
  async (req, res) => {
    const postId = parseInt(req.params.postId);
    if (req.auth && req.auth.isAdmin) {
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
    } else {
      res.status(401).json(noAuthMessage("toggle published status"));
    }
  }
);

// (Update) add a tag
postRouter.put("/add-tag", expressjwt(jwtExpressOpts), async (req, res) => {
  let { postId, tag } = req.body;
  if (req.auth && req.auth.isAdmin) {
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
  } else {
    req.status(401).json(noAuthMessage("add tags"));
  }
});

// Update (remove) a tag from a post.
postRouter.put("/remove-tag", expressjwt(jwtExpressOpts), async (req, res) => {
  let { postId, tag } = req.body;
  if (req.auth && req.auth.isAdmin) {
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
  } else {
    res.status.json(noAuthMessage("remove tags"));
  }
});

// DELETE
// Delete by id
postRouter.delete("/:postId", expressjwt(jwtExpressOpts), async (req, res) => {
  let postId = parseInt(req.params.postId);
  if (req.auth && req.auth.isAdmin) {
    try {
      let deletedPost = await prisma.post.delete({ where: { id: postId } });
      res.json(deletedPost);
    } catch (error) {
      res.status(500).json({
        message: `There was a problem when deleting post ${postId}.`,
        error: error,
      });
    }
  } else {
    res.status(401).json(noAuthMessage("delete posts"));
  }
});

// Delete all posts
postRouter.delete("/", async (req, res) => {
  if (req.auth && req.auth.isAdmin) {
    try {
      let posts = await prisma.post.deleteMany({});
      res.json(posts);
    } catch (error) {
      res.status(500).json({
        message: "There was a problem when trying to delete all posts.",
        error: error,
      });
    }
  } else {
    res.status(401).json(noAuthMessage("delete posts"));
  }
});

export default postRouter;
