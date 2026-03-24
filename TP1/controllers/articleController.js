const ArticleModel = require('../models/articleModel');

exports.createArticle = async (req, res) => {
    try {
        const { titre, contenu, auteur, date, categorie, tags } = req.body;
        if (!titre || !contenu) {
            return res.status(400).json({ erreur: "Le titre et le contenu sont obligatoires." });
        }
        const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
        const result = await ArticleModel.create(titre, contenu, auteur, date || new Date().toISOString().split('T')[0], categorie, tagsString);
        res.status(201).json({ message: "Article enregistré !", id: result.insertId });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};

exports.getArticles = async (req, res) => {
    try {
        const { categorie, auteur } = req.query;
        const articles = await ArticleModel.findAll(categorie, auteur);
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};

exports.searchArticles = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ erreur: "Le paramètre 'query' est requis." });
        
        const articles = await ArticleModel.search(query);
        if (articles.length === 0) {
            return res.status(200).json({ message: `Aucun article ne correspond à votre recherche : "${query}"`, results: [] });
        }
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ erreur: "L'ID doit être un nombre valide." });

        const article = await ArticleModel.findById(id);
        if (!article) return res.status(404).json({ erreur: `L'article avec l'ID ${id} n'existe pas.` });
        
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { titre, contenu, categorie, tags } = req.body;
        const { id } = req.params;
        const tagsString = Array.isArray(tags) ? tags.join(',') : (tags || null);

        const result = await ArticleModel.update(id, titre || null, contenu || null, categorie || null, tagsString);
        if (result.affectedRows === 0) return res.status(404).json({ erreur: "Article non trouvé ou aucune modification" });

        res.status(200).json({ message: "Article mis à jour avec succès", id: id });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ erreur: "L'ID doit être un nombre valide." });

        const result = await ArticleModel.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ erreur: `L'article avec l'ID ${id} n'existe pas.` });

        res.status(200).json({ message: "Article supprimé avec succès", id: id });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
};
