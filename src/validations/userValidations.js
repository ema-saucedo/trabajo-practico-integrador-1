import { body } from "express-validator";

// Estas reglas controlan los datos para crear un usuario. body("...") indica
// qué campo del cuerpo de la petición se está revisando.
export const userValidations = [
  // El username es obligatorio, debe medir de 3 a 20 caracteres y tener solo
  // letras y números.
  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números"),

  // El email es obligatorio y debe tener un formato de correo válido.
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),

  // La contraseña es obligatoria y debe cumplir con los requisitos mínimos
  // indicados para que no sea demasiado simple.
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener al menos un número"),

  // El rol no es obligatorio; si se envía, solo puede ser user o admin.
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El role debe ser user o admin"),
];

// Para actualizar un usuario, los campos son opcionales porque se puede cambiar
// solo uno de ellos. Si se envían, igualmente tienen que cumplir estas reglas.
export const updateUserValidations = [
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username solo puede contener letras y números"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El email no es válido"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El role debe ser user o admin"),
];

// Para iniciar sesión alcanza con que el email tenga formato válido y que se
// envíe una contraseña; la comprobación de que coincidan se hace en el controller.
export const loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];