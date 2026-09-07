import "./src/models/Associations.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { router as authRouter } from "./src/routes/authRoutes.js"
import { router as userRouter } from "./src/routes/userRoutes.js";
import { router as tagRouter } from "./src/routes/tagRoutes.js";

import { startDB } from "./src/config/db.js";

const app = express();


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tags", tagRouter);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await startDB();

  app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
  });
};

startServer();