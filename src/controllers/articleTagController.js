import { ArticleTag } from "../models/ArticleTag.js";
import { Article } from "../models/Article.js";
import { Tag } from "../models/Tag.js";

export const addTagToArticle = async (req, res) => {
  try {
    const { article_id, tag_id } = req.body;

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

    if (article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "No tenés permisos para modificar este artículo",
      });
    }

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

export const removeTagFromArticle = async (req, res) => {
  try {
    const articleTag = await ArticleTag.findByPk(req.params.articleTagId);

    if (!articleTag) {
      return res.status(404).json({
        message: "Relación entre artículo y tag no encontrada",
      });
    }

    const article = await Article.findByPk(articleTag.article_id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    if (article.user_id !== req.user.id) {
      return res.status(403).json({
        message: "No tenés permisos para modificar este artículo",
      });
    }

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