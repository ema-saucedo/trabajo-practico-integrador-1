import { verifyToken } from "../helpers/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    //acá se busca el token, para luego con el req.cookies.token le pedimos que nos de el contenido de esa cookie
    const token = req.cookies.token;
    //y si no tiene token no lo doejamos continuar y le damos un error 401 o es lo mismo decir que no se pudo comprobar que esta autenticado
    if (!token) {
      return res.status(401).json({
        message: "No se proporcionó un token",
      });
    }

    //si existe el token seguimos acá, donde decoded va a tener el contenido del verifyToken(id, role)

    const decoded = verifyToken(token);
    // el req es la peticion que recorre la aplicacion, donde le agregamos la propiedad de user para meter en eso los datos que recuperamos del jwt (osea que dentro de req.user lo que se guarda es todo el objeto decoded, y en otro momento podemos acceder a ellos con req.user.id o req.user.role) esto sirve porque mas adelante el controlador puede llegar a necesitar crear un articulo para el usuario que esta logueado
    req.user = decoded;

    //el next es simplemente decirle que si el middleware termino correctamente, que continue con lo que sigue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};
