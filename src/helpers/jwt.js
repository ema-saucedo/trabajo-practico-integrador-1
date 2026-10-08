import  jwt  from "jsonwebtoken";
import "dotenv/config";

// Crea un token con los datos recibidos (por ejemplo, el id y el rol del usuario).
// La clave secreta se lee desde las variables de entorno y el token dura una hora.
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

// Verifica que el token sea válido y no haya expirado. Si no lo es, jsonwebtoken
// genera un error que puede ser atendido por el middleware de autenticación.
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};