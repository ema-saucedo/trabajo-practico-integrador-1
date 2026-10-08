//Cuarto paso
//aca se importan los paquetes necesarios para poder usar sequelize y definir el modelo de User, que es el modelo que representa a los usuarios en la base de datos, y se exporta para poder usarlo en otros archivos
import { User } from "../models/User.js";
//esto es la funcion para hashear la contraseña del usuario antes de guardarla en la base de datos, para que no se guarde en texto plano y sea más seguro
import { hashPassword } from "../helpers/bcrypt.js";
import { Profile } from "../models/Profile.js";
import { Article } from "../models/Article.js";
//esto es para poder usar los operadores de sequelize, como el de ne (not equal) para poder buscar un usuario por email que no sea el mismo que se esta actualizando
import { Op } from "sequelize";

//esto es para obtener todos los usuarios de la base de datos, excluyendo la contraseña y incluyendo el perfil de cada usuario, y devolverlos en formato json
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
    });
//y aca se retornan los usuarios en formato json con un status 200, y si hay un error se retorna un status 500 con un mensaje de error interno del servidor
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
//esta funcion es para obtener un solo usuario mediante su id, excluyendo la contraseña y incluyendo el perfil y los artículos del usuario, y devolverlo en formato json
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Profile,
          as: "profile",
        },
        {
          model: Article,
          as: "articles",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
//esta funcion es para crear un nuevo usuario, primero se desestructura el objeto req.body que es por donde vienen los datos que pone el usuario en el formulario, luego se hashea la contraseña con la funcion hashPassword, luego se crea el usuario en la base de datos con el modelo User y se crea su perfil con el modelo Profile, y finalmente se retorna un 201 con un mensaje de exito y los datos del usuario creado, y si hay un error se retorna un 500 con un mensaje de error.
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await Profile.create({
      user_id: newUser.id,
      first_name,
      last_name,
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
//esto es para actualizar un usuario, primero se busca el usuario por su id, si no se encuentra se retorna un 404 con un mensaje de error, luego se desestructura el objeto req.body que es por donde vienen los datos que pone el usuario en el formulario, si se pasa un email se busca si ya existe otro usuario con ese email y si es asi se retorna un 400 con un mensaje de error, luego se actualiza el usuario con los datos que se pasaron y finalmente se retorna un 200 con un mensaje de exito y los datos del usuario actualizado, y si hay un error se retorna un 500 con un mensaje de error.
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const { username, email, role } = req.body;
//aca se hace la validacion para que no se pueda actualizar el email a uno que ya exista en otro usuario, y se usa el operador ne (not equal) para que no se compare con el mismo usuario que se esta actualizando, y se usa paranoid: false para que se busquen los usuarios eliminados tambien, ya que si un usuario fue eliminado logicamente, su email sigue existiendo en la base de datos y no se puede usar para otro usuario.
    if (email) {
      const existingEmail = await User.findOne({
        where: {
          email,
          id: {
            [Op.ne]: user.id,
          },
        },
        //el paranoid: false es para que se busquen los usuarios eliminados tambien, ya que si un usuario fue eliminado logicamente, su email sigue existiendo en la base de datos y no se puede usar para otro usuario.
        paranoid: false,
      });

      if (existingEmail) {
        return res.status(400).json({
          message: "El email ya está en uso",
        });
      }
    }

    await user.update({
      username,
      email,
      role,
    });

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
//esto es para eliminar un usuario, primero se busca el usuario por su id, si no se encuentra se retorna un 404 con un mensaje de error, luego se elimina el usuario y finalmente se retorna un 200 con un mensaje de exito, y si hay un error se retorna un 500 con un mensaje de error.
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
