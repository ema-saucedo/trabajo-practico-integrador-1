import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";
import { Profile } from "../models/Profile.js";

// Registra una cuenta y crea su perfil asociado.
export const register = async (req, res) => {
  try {
    // Se toman los datos de usuario y perfil que llegaron en el cuerpo.
    const { username, email, password } = req.body;
    const first_name = req.body.first_name || req.body.nombre;
    const last_name = req.body.last_name || req.body.apellido;
    const biography =
      req.body.biography ||
      (req.body.profile && req.body.profile.bio) ||
      req.body.bio ||
      null;

    // Además de las validaciones de la ruta, acá se comprueba que estén todos
    // los datos que necesita este proceso para crear usuario y perfil.
    // 1. Validar que todos los datos obligatorios lleguen en la petición
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios. Verifica los nombres de las variables enviadas.",
      });
    }

    // Antes de crear la cuenta, se revisa que email y username no estén usados.
    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "El email ya está registrado",
      });
    }

    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "El nombre de usuario ya está registrado",
      });
    }

    // La contraseña se guarda hasheada, nunca como texto legible.
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // El perfil se relaciona con el usuario recién creado usando su id.
    const newProfile = await Profile.create({
      user_id: newUser.id,
      first_name,
      last_name,
      biography,
    });

    // Se devuelve información pública de la cuenta, sin incluir la contraseña.
    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Primero se busca la cuenta por email. Si no existe, las credenciales no
    // son válidas y se responde igual que cuando la contraseña no coincide.
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }
    //Esto usé para comprobar que la contraseña que ingresa el usuario es la misma a la contraseña hasheada que ya esta registrada por eso se usa el comparePassword que hice en el helper bcrypt
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }
    //esto genera un payload con el id y el rol del usuario
    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    // La cookie httpOnly no puede ser leída directamente desde JavaScript del
    // navegador. Su duración coincide con la del token.
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Inicio de sesión existoso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Borra del navegador la cookie usada para enviar el token en las peticiones.
    res.clearCookie("token");

    return res.status(200).json({
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // El id viene del token que authMiddleware ya guardó en req.user.
    const profile = await Profile.findOne({
      where: {
        user_id: req.user.id,
      },
    });
    if (!profile) {
      return res.status(404).json({
        message: "Perfil no encontrado",
      });
    }

    return res.status(200).json({
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Se reciben los campos que pueden modificarse en el perfil.
    const { first_name, last_name, biography, avatar_url, birth_date } =
      req.body;

    // Se busca el perfil del usuario autenticado, no un perfil indicado por URL.
    const profile = await Profile.findOne({
      where: {
        user_id: req.user.id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Perfil no encontrado",
      });
    }

    // Sequelize actualiza el registro existente con los valores recibidos.
    await profile.update({
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date,
    });

    return res.status(200).json({
      message: "Perfil actualizaco correctamente",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
