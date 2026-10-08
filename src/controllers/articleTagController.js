import { ArticleTag } from "../models/ArticleTag.js";
import { Article } from "../models/Article.js";
import { Tag } from "../models/Tag.js";

// Crea la asociación entre un artículo y un tag (una relación de muchos a muchos).
export const addTagToArticle = async (req, res) => {
  try {
    // Los ids de ambos registros llegan en el cuerpo de la petición.
    const { article_id, tag_id } = req.body;

    // Se comprueba que existan los dos registros antes de crear la asociación.
    const article = await Article.findByPk(article_id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    const tag = await Tag.findByPk(tag_id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    // Solo quien creó el artículo puede modificar los tags asociados.
    if (article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "No tenés permisos para modificar este artículo",
      });
    }

    // Evita crear dos veces la misma asociación entre artículo y tag.
    const existingRelation = await ArticleTag.findOne({
      where: {
        article_id,
        tag_id,
      },
    });

    if (existingRelation) {
      return res.status(400).json({
        message: "El tag ya está asociado a este artículo",
      });
    }

    // Se guarda la relación usando las claves de artículo y tag.
    const articleTag = await ArticleTag.create({
      article_id,
      tag_id,
    });

    return res.status(201).json({
      message: "Tag agregado al artículo correctamente",
      articleTag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Elimina una asociación artículo-tag usando el id de esa relación.
export const removeTagFromArticle = async (req, res) => {
  try {
    // El identificador de la relación viene en la URL.
    const articleTag = await ArticleTag.findByPk(req.params.articleTagId);

    if (!articleTag) {
      return res.status(404).json({
        message: "Relación entre artículo y tag no encontrada",
      });
    }

    // Se obtiene el artículo relacionado para comprobar que todavía exista
    // y verificar sus permisos de edición.
    const article = await Article.findByPk(articleTag.article_id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    // Igual que al agregar, solo el dueño puede cambiar las asociaciones.
    if (article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "No tenés permisos para modificar este artículo",
      });
    }

    // Elimina únicamente la relación; no elimina el artículo ni el tag.
    await articleTag.destroy();

    return res.status(200).json({
      message: "Tag eliminado del artículo correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
