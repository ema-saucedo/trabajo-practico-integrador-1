import { Article } from "../models/Article.js";

// Este middleware comprueba que el artículo exista y que quien hace la petición
// sea su dueño o tenga rol de administrador antes de permitir modificarlo.
export const ownerMiddleware = async (req, res, next) => {
    
    try {
        // El id del artículo viene en la URL, por ejemplo en /articles/5.
        const article = await Article.findByPk(req.params.id);
        
        // Si no existe el artículo, no hay nada que el controlador pueda modificar.
        if(!article) {
            return res.status(404).json({
                message:"Artículo no encontrado"
            });
        }

        // Un administrador puede continuar sin ser el dueño del artículo.
        if (req.user.role === "admin") {
            return next();
        }

        // Para los demás usuarios, se compara el id del dueño con el del token.
        if (article.user_id !== req.user.id) {
            return res.status(403).json({
                message:"No tenés permisos para realizar esta ación"
            });
        }

        // Si es el dueño, se permite que la petición llegue al controlador.
        next();
    
    } catch(error) {
        // Si falla la consulta, se informa un error interno del servidor.
        return res.status(500).json({
            message:"Error interno del servidor"
        });
    }
};