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
import { tagValidations } from "../validations/tagValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

// Cualquier usuario autenticado puede consultar la lista de tags.
router.get("/", authMiddleware, getTags);

// Las demás operaciones de tags quedan reservadas para administradores.
router.get("/:id", authMiddleware, adminMiddleware, getTagById);
// Al crear o editar, se valida el nombre antes de ejecutar el controller.
router.post("/", authMiddleware, adminMiddleware, tagValidations, validate, createTag);
router.put("/:id", authMiddleware, adminMiddleware, tagValidations, validate, updateTag);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTag);