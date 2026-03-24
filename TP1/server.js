const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const articleRoutes = require('./routes/articleRoutes'); // On importe tes routes

const app = express();
app.use(express.json());

// --- CONFIGURATION SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion d\'Articles',
      version: '1.0.0',
      description: 'API simple permettant de gerer des articles',
    },
    servers: [{ url: 'http://localhost:3000' }],
    // Tes schémas Swagger (Article) restent ici
    components: {
      schemas: {
        Article: {
          type: 'object',
          required: ['titre', 'auteur'],
          properties: {
            id: { type: 'integer' },
            titre: { type: 'string' },
            contenu: { type: 'string' },
            auteur: { type: 'string' },
            date: { type: 'string', format: 'date' },
            categorie: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  // ATTENTION : On dit à Swagger d'aller lire les commentaires dans le dossier routes !
  apis: ['./routes/*.js'], 
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// On connecte les routes
app.use('/api/articles', articleRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
    console.log(`Docs : http://localhost:${PORT}/api-docs`);
});
