import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export const startDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con la Base de Datos Exitosa");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};