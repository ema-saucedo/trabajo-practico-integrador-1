import { Article } from "../models/Article.js";
import { ArticleTag } from "../models/ArticleTag.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const newArticle = await Article.create({
      title,
      content,
      excerpt,
      status,
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

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
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
