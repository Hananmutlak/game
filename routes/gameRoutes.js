// routes/gameRoutes.js
const gameController = require('../controllers/gameController');

const gameRoutes = async (fastify, options) => {
  // Root API route - GET /api
  fastify.get('/api', gameController.getApiInfo);

  // Health check route - GET /api/health
  fastify.get('/api/health', gameController.healthCheck);

  // GET all games - GET /api/games
  fastify.get('/api/games', gameController.getAllGames);

  // GET game by ID - GET /api/games/:id
  fastify.get('/api/games/:id', gameController.getGameById);

  // POST create new game - POST /api/games
  fastify.post('/api/games', gameController.createGame);

  // PUT update game - PUT /api/games/:id
  fastify.put('/api/games/:id', gameController.updateGame);

  // DELETE game - DELETE /api/games/:id
  fastify.delete('/api/games/:id', gameController.deleteGame);
};

module.exports = gameRoutes;