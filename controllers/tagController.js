import { Router } from "express";
import prisma from "../prisma/pClient.js";

let tagRouter = Router();

// GET
// Get all
tagRouter.get("/", async (req, res) => {
  try {
    let tags = await prisma.tag.findMany({
      include: {
        posts: true,
      },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "There was a problem when fetching all tags.",
      error: error,
    });
  }
});

// Get list of all tags
tagRouter.get("/list", async (req, res) => {
  try {
    let tags = await prisma.tag.findMany({
      orderBy: [{ name: "asc" }],
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "There was a problem when getting the list of tags.",
      error: error,
    });
  }
});

// Get by id
tagRouter.get("/:tagId", async (req, res) => {
  let tagId = parseInt(req.params.tagId);
  try {
    let tag = await prisma.tag.findUnique({ where: { id: tagId } });
    res.json(tag);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when fetching tag ${tagId}.`,
      error: error,
    });
  }
});

// Get tag with posts by name
tagRouter.get("/name/:tagName", async (req, res) => {
  let tagName = req.params.tagName;
  try {
    const tag = await prisma.tag.findMany({
      where: { name: tagName },
      include: {
        posts: true,
      },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({
      message: `There was a problem when fetching tag '${tagName}'.`,
      error: error,
    });
  }
});

// POST
tagRouter.post("/", async (req, res) => {
  let { name } = req.body;
  try {
    let newTag = await prisma.tag.create({
      data: { name },
    });
    res.json(newTag);
  } catch (error) {
    res.status(500).json({
      message: "There was a problem when trying to create this tag.",
      error: error,
    });
  }
});

// PUT
tagRouter.put("/", async (req, res) => {
  let { id, name } = req.body;
  try {
    let updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    res.json(updatedTag);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when updating tag ${id}.`,
      error: error,
    });
  }
});

// DELETE
// Delete by id
tagRouter.delete("/:tagId", async (req, res) => {
  let tagId = parseInt(req.params.tagId);
  try {
    let deleteTag = await prisma.tag.delete({ where: { id: tagId } });
    res.json(deleteTag);
  } catch (error) {
    res.status(500).json({
      message: `There was an error when deleting tag ${tagId}.`,
      error: error,
    });
  }
});

// Delete all
tagRouter.delete("/", async (req, res) => {
  try {
    let tags = await prisma.tag.deleteMany({});
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "There was a problem when deleting all tags.",
      error: error,
    });
  }
});

export default tagRouter;
