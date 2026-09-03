import { Article } from "../models/Article";

export const ownerMiddleware = async (req, res, next) => {
    
    try {
        const article = await Article.findByPk(req.params.id);
        
        if(!article) {
            return res.status(404).json({
                message:"Artículo no encontrado"
            });
        }

        if (req.user.role === "admin") {
            return next();
        }

        if (article.user_id !== req.user.id) {
            return res.status(403).json({
                message:"No tenés permisos para realizar esta ación"
            });
        }

        next();
    
    } catch(error) {
        return res.status(500).json({
            message:"Error interno del servidor"
        });
    }
};