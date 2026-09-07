import express from "express";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articleTagController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const router = express.Router();

router.post("/", authMiddleware, addTagToArticle);

router.delete("/:articleTagId", authMiddleware, removeTagFromArticle);
