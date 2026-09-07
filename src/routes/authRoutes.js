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
import { userValidations } from "../validations/userValidations.js";
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

router.post("/register",userValidations,registerProfileValidations,validate,register);
router.post("/logout", authMiddleware,logout);
router.get("/profile",authMiddleware,getProfile);
router.put("/profile",authMiddleware,profileValidations,validate,updateProfile);