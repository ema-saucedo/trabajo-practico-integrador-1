import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
  {
    paranoid: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);
