import { body } from "express-validator";

export const tagValidations = [
  body("name")
    .notEmpty()
    .withMessage("El nombre del tag es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre del tag debe tener entre 2 y 30 caracteres"),
];