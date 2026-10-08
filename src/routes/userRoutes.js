import express from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { userValidations, updateUserValidations } from "../validations/userValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

// Estas operaciones son administrativas: primero se comprueba que haya sesión
// y después que el usuario autenticado tenga el rol admin.
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);

// En las rutas que reciben datos también se ejecutan las validaciones y luego
// validate; si algo no cumple las reglas, el controller no llega a ejecutarse.
router.post("/", authMiddleware, adminMiddleware,userValidations, validate, createUser);
router.put("/:id", authMiddleware, adminMiddleware,updateUserValidations, validate, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
