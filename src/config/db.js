//Segundo paso
//aca importamos el paquete Sequelize y dotenv para poder usar variables de entorno
import { Sequelize } from "sequelize";
//se importa dotenv para poder usar variables de entorno
import "dotenv/config";
//esta es la configuración de la base de datos, se crea una instancia de Sequelize con los datos de conexión a la base de datos, que se obtienen de las variables de entorno, y se exporta para poder usarla en otros archivos
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  //aca se configura el host y el dialecto de la base de datos, que en este caso es mysql
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);
//esta es la función que inicia la conexión con la base de datos, se exporta para poder usarla en otros archivos
export const startDB = async () => {
  //aca se intenta autenticar la conexión con la base de datos y sincronizar los modelos, si hay un error se muestra en consola
  try {
    await sequelize.authenticate();
    //aca se sincronizan los modelos con la base de datos, si no existen las tablas se crean, si existen se actualizan
    await sequelize.sync();
    console.log("Conexión con la Base de Datos Exitosa");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};