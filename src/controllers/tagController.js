import { Tag } from "../models/Tag.js";

// Obtiene todos los tags y los devuelve en la respuesta.
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();

    return res.status(200).json({
      tags,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Busca un tag por su id; si no existe, devuelve un 404.
export const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    return res.status(200).json({
      tag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Crea un tag nuevo, comprobando primero que no exista otro con el mismo nombre.
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTag = await Tag.findOne({
      where: { name },
    });

    if (existingTag) {
      return res.status(400).json({
        message: "El tag ya existe",
      });
    }

    const newTag = await Tag.create({
      name,
    });

    return res.status(201).json({
      message: "Tag creado correctamente",
      tag: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Busca el tag antes de actualizarlo para poder responder 404 si no existe.
export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    const { name } = req.body;

    await tag.update({
      name,
    });

    return res.status(200).json({
      message: "Tag actualizado correctamente",
      tag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Busca el tag antes de eliminarlo; destroy lo borra según la configuración
// del modelo Tag, que en este proyecto no tiene activado el borrado lógico.
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    await tag.destroy();

    return res.status(200).json({
      message: "Tag eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
