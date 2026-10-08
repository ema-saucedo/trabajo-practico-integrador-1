//Tercer paso
//aca se importan los paquetes necesarios para poder usar sequelize y definir el modelo de Article, que es el modelo que representa a los artículos en la base de datos, y se exporta para poder usarlo en otros archivos
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
//con esto se crea el modelo de Article, que es el modelo que representa a los artículos en la base de datos, y se exporta para poder usarlo en otros archivos
export const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
//El DataTypes.ENUM sirve para que nosotros podamos definir los unicos valores que se van a poder tomar como en este caso es el de published y el de archived, por ejemplo en el de users en la parte de roles, dimos para que tenga dos valores admin o user, el defaultValue, sirve para si no se llega a elegir ningun valor de los que definimos por defecto ya lo deje en este caso en published.
      type: DataTypes.ENUM("published", "archived"),
      allowNull: false,
      defaultValue: "published",
    },
//Acá en el user id no se pone el unique:true porque un usuario puede tener más de un artículo
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  //esto es para que sequelize cree las columnas created_at, updated_at y deleted_at en la tabla de articles, y que se usen para el control de cambios y borrado lógico de los registros
  {
    paranoid: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);
