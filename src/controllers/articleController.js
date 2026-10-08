import { Article } from "../models/Article.js";
import { ArticleTag } from "../models/ArticleTag.js";
import { User } from "../models/User.js";

// Crea un artículo y lo asocia con el usuario que inició sesión.
export const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const newArticle = await Article.create({
      title,
      content,
      excerpt,
      status,
      // El dueño sale del token, así no se puede elegir otro user_id en el body.
      user_id: req.user.id,
    });

    return res.status(201).json({
      message: "Artículo creado correctamente",
      article: newArticle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Devuelve solo artículos publicados e incluye datos públicos de quien los creó.
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        status: "published",
      },
      include: [
        {
          model: User,
          as: "author",
          // Se excluyen otros datos del usuario que no hacen falta en esta respuesta.
          attributes: ["id", "username"],
        },
      ],
    });

    return res.status(200).json({
      articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Busca un artículo usando el id recibido en la URL.
// A diferencia de getArticles, acá no se filtra por status, así que también
// puede devolver un artículo archived si existe.
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    return res.status(200).json({
      article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Devuelve los artículos publicados del usuario que inició sesión.
export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        user_id: req.user.id,
        status: "published",
      },
    });

    return res.status(200).json({
      articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Busca artículos por el id de usuario recibido en la URL.
// Esta consulta tampoco filtra por status, por lo que puede incluir artículos
// archived además de los publicados.
export const getArticlesByUser = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    return res.status(200).json({
      articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Actualiza los datos del artículo. La ruta ya ejecutó ownerMiddleware antes
// de llegar acá para verificar los permisos de quien realiza el cambio.
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    const { title, content, excerpt, status } = req.body;

    await article.update({
      title,
      content,
      excerpt,
      status,
    });

    return res.status(200).json({
      message: "Artículo actualizado correctamente",
      article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Elimina el artículo y primero borra las relaciones con tags para que no queden
// asociaciones apuntando a un artículo eliminado.
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    await ArticleTag.destroy({
      where: {
        article_id: article.id,
      },
    });

    await article.destroy();

    return res.status(200).json({
      message: "Artículo eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
