require('dotenv').config();
const fastify = require('fastify')({ 
  logger: true 
});
const cors = require('@fastify/cors');
const sensible = require('@fastify/sensible');

// Import database and models
const connectDB = require('./config/database');
const { Game } = require('./models');

// Register plugins
fastify.register(cors);
fastify.register(sensible);

// Root route - GET /api
fastify.get('/api', async (request, reply) => {
  return {
    message: '🎮 Game Collection API with Fastify & MongoDB',
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
    const gameCount = await Game.countDocuments();
    return {
      status: 'OK',
      message: 'Game Collection API is running',
      database: 'MongoDB Atlas',
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
    const games = await Game.find().sort({ createdAt: -1 });
    
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
    const game = await Game.findById(request.params.id);
    
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
fastify.post('/api/games', async (request, reply) => {
  try {
    const game = await Game.create(request.body);
    
    reply.code(201);
    return {
      success: true,
      message: 'Game created successfully',
      data: game
    };
  } catch (error) {
    if (error.name === 'ValidationError') {
      return reply.badRequest('Validation failed: ' + Object.values(error.errors).map(err => err.message).join(', '));
    }
    reply.internalServerError('Failed to create game');
  }
});

// PUT update game
fastify.put('/api/games/:id', async (request, reply) => {
  try {
    const game = await Game.findById(request.params.id);
    
    if (!game) {
      return reply.notFound('Game not found');
    }

    Object.assign(game, request.body);
    await game.save();

    return {
      success: true,
      message: 'Game updated successfully',
      data: game
    };
  } catch (error) {
    if (error.name === 'ValidationError') {
      return reply.badRequest('Validation failed: ' + Object.values(error.errors).map(err => err.message).join(', '));
    }
    reply.internalServerError('Failed to update game');
  }
});

// DELETE game
fastify.delete('/api/games/:id', async (request, reply) => {
  try {
    const game = await Game.findByIdAndDelete(request.params.id);
    
    if (!game) {
      return reply.notFound('Game not found');
    }

    return {
      success: true,
      message: 'Game deleted successfully'
    };
  } catch (error) {
    reply.internalServerError('Failed to delete game');
  }
});

// 404 handler
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
    // Connect to MongoDB
    await connectDB();
    
    // Start Fastify server
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`🗄️ Database: MongoDB Atlas`);
    console.log(`⚡ Framework: Fastify with Mongoose`);
    
  } catch (err) {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
};

start();