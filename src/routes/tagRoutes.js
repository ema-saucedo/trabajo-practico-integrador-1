import express from "express";

import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

export const router = express.Router();

router.get("/", authMiddleware, getTags);
router.get("/:id", authMiddleware, adminMiddleware, getTagById);
router.post("/", authMiddleware, adminMiddleware, createTag);
router.put("/:id", authMiddleware, adminMiddleware, updateTag);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTag);