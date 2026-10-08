//Primer paso
//acá se importa las asociaciones entre los modelos para que sequelize las reconozca
import "./src/models/Associations.js";
//acá se importa la configuración de la base de datos para que sequelize la reconozca
import express from "express";
//acá se importa la configuración de las variables de entorno
import cors from "cors";
//acá se importa la configuración de las cookies
import cookieParser from "cookie-parser";
//acá se importa la configuración de las rutas
import "dotenv/config";
//acá se importa la configuración de las rutas
import { router as authRouter } from "./src/routes/authRoutes.js"
//acá se importa la configuración de las rutas
import { router as userRouter } from "./src/routes/userRoutes.js";
//acá se importa la configuración de las rutas
import { router as tagRouter } from "./src/routes/tagRoutes.js";
//acá se importa la configuración de las rutas
import { router as articleRouter } from "./src/routes/articleRoutes.js";
//acá se importa la configuración de las rutas
import { router as articleTagRouter } from "./src/routes/articleTagRoutes.js";

//acá se importa la configuración de la base de datos
import { startDB } from "./src/config/db.js";

//acá se crea la aplicación de express
const app = express();


// En tu backend (app.js)}
//se usa cors para permitir el acceso desde el frontend
app.use(cors({
  // Configura el origen permitido para las solicitudes CORS
    origin: 'http://localhost:5173', // La URL por defecto de Vite
    // Configura las credenciales para permitir el envío de cookies
    credentials: true // Obligatorio para que viajen las cookies del JWT
}));
//se usa cookieParser para poder leer las cookies, express.json() para poder leer el body de las solicitudes en formato JSON y express.urlencoded() para poder leer el body de las solicitudes en formato URL-encoded, lo demas son las rutas de la API, como authRouter, userRouter, tagRouter, articleRouter y articleTagRouter que cada una lleva a su respectivo archivo de rutas, y cada archivo de rutas tiene sus respectivos controladores y modelos.
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tags", tagRouter);
app.use("/api/articles", articleRouter);
app.use("/api/article-tags", articleTagRouter);


//esto es para que el servidor escuche en el puerto 3000 o en el puerto que se le pase por variable de entorno
const PORT = process.env.PORT || 3000;
//esta es la función que inicia el servidor, primero inicia la base de datos y luego inicia el servidor en el puerto especificado
const startServer = async () => {
  await startDB();
//acá se inicia el servidor
  app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
  });
};
//acá se llama a la función que inicia el servidor
startServer();