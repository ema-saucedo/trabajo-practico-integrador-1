import express from "express";

import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
} from "../controllers/authController.js"

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { profileValidations, registerProfileValidations } from "../validations/profileValidations.js";
import { userValidations, loginValidations } from "../validations/userValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

// Cada ruta indica primero el método y la dirección; después se ejecutan, en
// orden, los middlewares, las validaciones, validate y finalmente el controller.
// El registro no requiere autenticación porque justamente crea una cuenta nueva.
router.post("/register", userValidations, registerProfileValidations, validate, register);

// Para iniciar sesión tampoco se necesita un token previo; se validan las
// credenciales antes de que el controller las compare con las guardadas.
router.post("/login", loginValidations, validate, login);

// Cerrar sesión y consultar o editar el perfil sí requieren que la persona
// esté autenticada, por eso estas rutas pasan primero por authMiddleware.
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, profileValidations, validate, updateProfile);
