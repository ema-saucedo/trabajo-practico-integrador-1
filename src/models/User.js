import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
    "User",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        username:{
            type:DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role:{
            type: DataTypes.ENUM("user","admin"),
            allowNull: false,
            toDefaultValue: "user"
        },
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updateAt: "update_at",
        deleteAt: "deleted_at"
    }
);