const db = require('../config/db');

const ArticleModel = {
    create: async (titre, contenu, auteur, date, categorie, tagsString) => {
        const sql = 'INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [titre, contenu, auteur, date, categorie, tagsString]);
        return result;
    },

    findAll: async (categorie, auteur) => {
        let sql = 'SELECT * FROM articles WHERE 1=1';
        const params = [];
        if (categorie) { sql += ' AND categorie = ?'; params.push(categorie); }
        if (auteur) { sql += ' AND auteur = ?'; params.push(auteur); }
        const [rows] = await db.execute(sql, params);
        return rows;
    },

    search: async (query) => {
        const searchTerm = `%${query}%`;
        const sql = 'SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?';
        const [rows] = await db.execute(sql, [searchTerm, searchTerm]);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM articles WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, titre, contenu, categorie, tagsString) => {
        const sql = 'UPDATE articles SET titre = IFNULL(?, titre), contenu = IFNULL(?, contenu), categorie = IFNULL(?, categorie), tags = IFNULL(?, tags) WHERE id = ?';
        const [result] = await db.execute(sql, [titre, contenu, categorie, tagsString, id]);
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM articles WHERE id = ?', [id]);
        return result;
    }
};

module.exports = ArticleModel;
