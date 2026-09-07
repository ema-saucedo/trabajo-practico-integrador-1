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
import {
  articleValidations,updateArticleValidations,} from "../validations/articleValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

router.post("/", authMiddleware, articleValidations, validate, createArticle);
router.get("/", authMiddleware, getArticles);
router.get("/user", authMiddleware, getMyArticles);
router.get("/user/:id", authMiddleware, getArticlesByUser);
router.get("/:id", authMiddleware, getArticleById);
router.put("/:id", authMiddleware, ownerMiddleware, updateArticleValidations, validate, updateArticle);
router.delete("/:id", authMiddleware, ownerMiddleware, deleteArticle);
