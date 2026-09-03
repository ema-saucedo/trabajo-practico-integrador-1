import { User } from "../models/User.js"
import { hashPassword, comparePassword } from "../helpers/bcrypt.js"
import { generateToken } from "../helpers/jwt.js";
import { Profile } from "../models/Profile.js"

export const register = async (req, res) => {
    try {
        const {username, email, password } = req.body;

        const existingEmail = await User.findOne({
            where: {email}
        });

        if (existingEmail) {
            return res.status(400).json({
                message:"El email ya está registrado"
            });
        }

        const existingUsername = await User.findOne({
            where: { username }
        });

        if (existingUsername) {
            return res.status(400).json({
                message:"El nombre de usuario ya está registrado"
            })
        }

        const hashedPassword = await hashPassword(password);
        
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message:"Usuario registrado correctamente",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
        });
    } catch (error) {
         console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        });
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({
            where: {email},
        });

        if (!user) {
            return res.status(401).json({
                message:"Credenciales incorrectas"
            });
        }
        //Esto usé para comprobar que la contraseña que ingresa el usuario es la misma a la contraseña hasheada que ya esta registrada por eso se usa el comparePassword que hice en el helper bcrypt
        const isPasswordValid = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message:"Credenciales incorrectas"
            });
        }
        //esto genera un payload con el id y el rol del usuario
        const token = generateToken({
            id: user.id,
            role: user.role
        });
        
        res.cookie("token", token,{
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
            message: "Error interno del servidor"
        });
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie("token");
        
        return res.status(200).json({
            message:"Sesión cerrada correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            message:"Error interno del servidor",
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            where: {
                user_id: req.user.id,
            },
        });
        if (!profile) {
            return res.status(404).json({
                message:"Perfil no encontrado",
            });
        }

        return  res.status(200).json({
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            message:"Error interno del servidor",
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, biography, avatar_url, birth_date } = req.body

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

        await profile.update({
            first_name,
            last_name,
            biography,
            avatar_url,
            birth_date
        });

        return res.status(200).json({
            message:"Perfil actualizaco correctamente",
            profile
        });
        
    } catch (error) {
        return res.status(500).json({
            message:"Error interno del servidor",
        });
    }
}