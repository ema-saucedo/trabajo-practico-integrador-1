import express from "express";

import {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
} from "../controllers/authController.js"

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { profileValidations } from "../validations/profileValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout", authMiddleware,logout);
router.get("/profile",authMiddleware,getProfile);
router.put("/profile",authMiddleware,profileValidations,validate,updateProfile);