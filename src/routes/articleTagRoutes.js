import express from "express";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articleTagController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const router = express.Router();

// Ambas operaciones necesitan sesión. El controller verifica que exista el
// artículo/tag y que quien hace el cambio sea dueño del artículo.
router.post("/", authMiddleware, addTagToArticle);

// El id de la relación artículo-tag se recibe como parámetro de la URL.
router.delete("/:articleTagId", authMiddleware, removeTagFromArticle);
