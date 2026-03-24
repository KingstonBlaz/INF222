# INF222_TP1

# API de Gestion d'Articles - INF222

Ce projet est une API RESTful développée en Node.js et Express dans le cadre du cours INF222 (Développement Backend). Il constitue le backend d'une application de Blog, incluant la gestion complète des articles, la recherche, le filtrage et la documentation interactive.

## Fonctionnalités

- Opérations CRUD complètes sur les articles (Création, Lecture, Modification, Suppression).
- Recherche avancée par mots-clés dans le titre ou le contenu.
- Filtrage des articles (par catégorie, auteur, etc.).
- Validation stricte des entrées utilisateurs (champs obligatoires).
- Utilisation rigoureuse des codes d'état HTTP (200, 201, 400, 404, 500).
- Documentation de l'API intégrée avec Swagger.

## Prérequis

- Node.js (version 14 ou supérieure recommandée)
- Un serveur MySQL (XAMPP, WAMP, ou instance locale)

## Installation et Démarrage

1. Cloner le dépôt et accéder au dossier du projet :
\`\`\`bash
git clone https://github.com/KingstonBlaz/INF222
cd TP1
\`\`\`

2. Installer les dépendances du projet :
\`\`\`bash
npm install
npm install mysql2
\`\`\`
*Note : Le module mysql2 est requis pour la connexion à la base de données.*

3. Initialiser la base de données :
Exécutez le script SQL suivant dans votre environnement MySQL pour créer la base et la table nécessaires.

\`\`\`sql
CREATE DATABASE IF NOT EXISTS tp1_inf222;
USE tp1_inf222;

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    auteur VARCHAR(100) NOT NULL,
    date DATE,
    categorie VARCHAR(100),
    tags VARCHAR(255)
);
\`\`\`

4. Démarrer le serveur :
\`\`\`bash
node server.js
\`\`\`
Le serveur sera accessible à l'adresse : http://localhost:3000

## Documentation de l'API (Swagger)

L'ensemble des routes (endpoints) est documenté de manière interactive. Une fois le serveur démarré, vous pouvez consulter la documentation et tester les requêtes à l'adresse suivante :
http://localhost:3000/api-docs

## Aperçu des Endpoints

- GET /api/articles : Récupérer la liste des articles (accepte les filtres en query).
- GET /api/articles/search?query=texte : Rechercher un article.
- GET /api/articles/:id : Récupérer un article par son identifiant.
- POST /api/articles : Créer un nouvel article.
- PUT /api/articles/:id : Mettre à jour un article existant.
- DELETE /api/articles/:id : Supprimer un article.

## Exemples d'utilisation (cURL)

Création d'un article :
\`\`\`bash
curl -X POST http://localhost:3000/api/articles \
-H "Content-Type: application/json" \
-d '{
  "titre": "Introduction a Node.js",
  "contenu": "Ceci est le contenu de mon article.",
  "auteur": "Charles Njiosseu",
  "categorie": "Tech",
  "tags": ["nodejs", "backend"]
}'
\`\`\`

Recherche d'un article :
\`\`\`bash
curl -X GET "http://localhost:3000/api/articles/search?query=Node"
\`\`\`
