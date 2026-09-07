import express from "express";

import {
  createArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  getArticlesByUser,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ownerMiddleware } from "../middlewares/ownerMiddleware.js";

export const router = express.Router();

router.post("/", authMiddleware, createArticle);
router.get("/", authMiddleware, getArticles);
router.get("/user", authMiddleware, getMyArticles);
router.get("/user/:id", authMiddleware, getArticlesByUser);
router.get("/:id", authMiddleware, getArticleById);
router.put("/:id", authMiddleware, ownerMiddleware, updateArticle);
router.delete("/:id", authMiddleware, ownerMiddleware, deleteArticle);
