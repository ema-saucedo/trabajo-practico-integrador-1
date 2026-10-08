import express from "express";
//acá lo que se importa son las funciones del controlador que creamos para poder agregarlas a las rutas
import {
  createArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  getArticlesByUser,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
//lo mismo con esto, solo que acá agregamos los middlewares que creamos para poder usarlos en las rutas, como authMiddleware y ownerMiddleware
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ownerMiddleware } from "../middlewares/ownerMiddleware.js";
import {
  articleValidations,updateArticleValidations,} from "../validations/articleValidations.js";
//y acá importamos el middleware de validate que usamos para validar los datos que vienen en la petición antes de que lleguen al controlador, para que si hay algún error se devuelva un mensaje de error y no se ejecute el controlador.
import { validate } from "../middlewares/validate.js";

export const router = express.Router();

// Para crear un artículo se necesita una sesión; también se validan los datos
// antes de llamar al controller, que asigna el artículo al usuario autenticado.
router.post("/", authMiddleware, articleValidations, validate, createArticle);

// Estas consultas requieren estar autenticado, pero no usan ownerMiddleware
// porque no modifican artículos.
router.get("/", authMiddleware, getArticles);
// Esta ruta va antes de /:id para que la palabra "user" no se tome como un id.
router.get("/user", authMiddleware, getMyArticles);
router.get("/user/:id", authMiddleware, getArticlesByUser);
router.get("/:id", authMiddleware, getArticleById);

// Para modificar o eliminar, además de estar autenticado, se comprueba que la
// persona sea dueña del artículo o administradora.
router.put("/:id", authMiddleware, ownerMiddleware, updateArticleValidations, validate, updateArticle);
router.delete("/:id", authMiddleware, ownerMiddleware, deleteArticle);
