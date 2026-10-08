//en este modelo se importan los modelos de User, Profile, Article, Tag y ArticleTag para poder definir las asociaciones entre ellos.
import { User } from "./User.js";
import { Profile } from "./Profile.js";
import { Article } from "./Article.js";
import { Tag } from "./Tag.js";
import { ArticleTag } from "./ArticleTag.js";

//esto es para definir las asociaciones entre los modelos, en este caso se define que un usuario tiene un perfil, un perfil pertenece a un usuario, un usuario tiene muchos artículos, un artículo pertenece a un usuario, un artículo tiene muchas etiquetas y una etiqueta pertenece a muchos artículos.
User.hasOne(Profile,{
    foreignKey: "user_id",
    as:"profile",
    onDelete: "CASCADE"
});
//esto dice que un perfil pertenece a un usuario y que la clave foranea es user_id y que se puede acceder al usuario desde el perfil con el alias user
Profile.belongsTo(User, {
    foreignKey:"user_id",
    as:"user",
});
//esto dice que un usuario tiene muchos artículos y que la clave foranea es user_id y que se puede acceder a los artículos desde el usuario con el alias articles
User.hasMany(Article,{
    foreignKey:"user_id",
    as:"articles"
});
//esto dice que un artículo pertenece a un usuario y que la clave foranea es user_id y que se puede acceder al usuario desde el artículo con el alias author
Article.belongsTo(User,{
    foreignKey:"user_id",
    as:"author",
});
//esto dice que un artículo tiene muchas etiquetas y que una etiqueta pertenece a muchos artículos, y que la tabla intermedia es ArticleTag, y que la clave foranea del artículo es article_id y la clave foranea de la etiqueta es tag_id, y que se puede acceder a las etiquetas desde el artículo con el alias tags y a los artículos desde la etiqueta con el alias articles
Article.belongsToMany(Tag,{
    through: ArticleTag,
    foreignKey:"article_id",
    otherKey: "tag_id",
    as: "tags",
});
//esto dice que una etiqueta tiene muchos artículos y que un artículo pertenece a muchas etiquetas, y que la tabla intermedia es ArticleTag, y que la clave foranea de la etiqueta es tag_id y la clave foranea del artículo es article_id, y que se puede acceder a los artículos desde la etiqueta con el alias articles y a las etiquetas desde el artículo con el alias tags
Tag.belongsToMany(Article,{
    through: ArticleTag,
    foreignKey: "tag_id",
    otherKey:"article_id",
    as:"articles"
});