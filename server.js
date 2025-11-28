const fastify = require('fastify')({ 
  logger: true 
});
const cors = require('@fastify/cors');
const sensible = require('@fastify/sensible');

// Import database and models
const { initializeDatabase, Game } = require('./models');

// Register plugins
fastify.register(cors);
fastify.register(sensible);

// Root route - GET /api
fastify.get('/api', async (request, reply) => {
  return {
    message: '🎮 Game Collection API with Fastify',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      getAllGames: 'GET /api/games',
      getGame: 'GET /api/games/:id',
      createGame: 'POST /api/games',
      updateGame: 'PUT /api/games/:id',
      deleteGame: 'DELETE /api/games/:id'
    },
    timestamp: new Date().toISOString()
  };
});

// Health check route
fastify.get('/api/health', async (request, reply) => {
  try {
    const gameCount = await Game.count();
    return {
      status: 'OK',
      message: 'Game Collection API with Fastify is running',
      framework: 'Fastify',
      database: 'SQLite',
      total_games: gameCount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    reply.internalServerError('Database connection failed');
  }
});

// GET all games
fastify.get('/api/games', async (request, reply) => {
  try {
    const games = await Game.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    return {
      success: true,
      data: games,
      count: games.length
    };
  } catch (error) {
    reply.internalServerError('Failed to retrieve games');
  }
});

// GET game by ID
fastify.get('/api/games/:id', async (request, reply) => {
  try {
    const game = await Game.findByPk(request.params.id);
    
    if (!game) {
      return reply.notFound('Game not found');
    }

    return {
      success: true,
      data: game
    };
  } catch (error) {
    reply.internalServerError('Failed to retrieve game');
  }
});

// POST create new game
fastify.post('/api/games', {
  schema: {
    body: {
      type: 'object',
      required: ['title', 'platform', 'release_year', 'price'],
      properties: {
        title: { type: 'string', maxLength: 255 },
        platform: { type: 'string', maxLength: 100 },
        release_year: { type: 'integer', minimum: 1950, maximum: new Date().getFullYear() + 2 },
        price: { type: 'number', minimum: 0 },
        completed: { type: 'boolean' },
        playtime_hours: { type: 'integer', minimum: 0 }
      }
    }
  }
}, async (request, reply) => {
  try {
    const game = await Game.create(request.body);
    
    reply.code(201);
    return {
      success: true,
      message: 'Game created successfully',
      data: game
    };
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return reply.badRequest('Validation failed: ' + error.errors.map(err => err.message).join(', '));
    }
    reply.internalServerError('Failed to create game');
  }
});

// PUT update game
fastify.put('/api/games/:id', {
  schema: {
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', maxLength: 255 },
        platform: { type: 'string', maxLength: 100 },
        release_year: { type: 'integer', minimum: 1950, maximum: new Date().getFullYear() + 2 },
        price: { type: 'number', minimum: 0 },
        completed: { type: 'boolean' },
        playtime_hours: { type: 'integer', minimum: 0 }
      }
    }
  }
}, async (request, reply) => {
  try {
    const game = await Game.findByPk(request.params.id);
    
    if (!game) {
      return reply.notFound('Game not found');
    }

    await game.update(request.body);

    return {
      success: true,
      message: 'Game updated successfully',
      data: game
    };
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return reply.badRequest('Validation failed: ' + error.errors.map(err => err.message).join(', '));
    }
    reply.internalServerError('Failed to update game');
  }
});

// DELETE game
fastify.delete('/api/games/:id', async (request, reply) => {
  try {
    const game = await Game.findByPk(request.params.id);
    
    if (!game) {
      return reply.notFound('Game not found');
    }

    await game.destroy();

    return {
      success: true,
      message: 'Game deleted successfully'
    };
  } catch (error) {
    reply.internalServerError('Failed to delete game');
  }
});

// 404 handler for undefined routes
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /api',
      'GET /api/health',
      'GET /api/games',
      'GET /api/games/:id',
      'POST /api/games',
      'PUT /api/games/:id',
      'DELETE /api/games/:id'
    ]
  });
});

// Start server
const start = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start Fastify server
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Fastify server running on port 3000');
    console.log('📚 API available at http://localhost:3000/api');
    console.log('🗄️ Database: SQLite with Sequelize');
    console.log('⚡ Framework: Fastify');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();