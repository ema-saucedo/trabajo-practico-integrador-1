import { validationResult } from "express-validator";

// Este middleware se usa después de las validaciones de cada ruta para revisar
// si express-validator encontró algún dato incorrecto en la petición.
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  // Si hay errores, se responde con un 400 y no se deja avanzar al controlador.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // Si todos los datos pasaron las validaciones, continúa con lo que sigue.
  next();
};