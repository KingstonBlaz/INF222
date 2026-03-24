const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles du blog
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (avec filtres optionnels)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *     responses:
 *       200:
 *         description: Liste des articles récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', articleController.getArticles);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par mots-clés
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Mot-clé à rechercher dans le titre ou le contenu
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       400:
 *         description: Le paramètre 'query' est manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/search', articleController.searchArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article spécifique via son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérique de l'article
 *     responses:
 *       200:
 *         description: Article trouvé avec succès
 *       400:
 *         description: L'ID n'est pas valide
 *       404:
 *         description: Aucun article ne possède cet ID
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Ajouter un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Données manquantes ou invalides (ex. titre ou contenu manquant)
 *       500:
 *         description: Erreur serveur
 */
router.post('/', articleController.createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérique de l'article à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article'
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *       400:
 *         description: L'ID n'est pas valide
 *       404:
 *         description: Aucun article ne possède cet ID
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', articleController.updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérique de l'article à supprimer
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       400:
 *         description: L'ID n'est pas valide
 *       404:
 *         description: Aucun article ne possède cet ID
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
