// controllers/gameController.js
const { Game } = require('../models');

const gameController = {
  // GET all games
  getAllGames: async (request, reply) => {
    try {
      const games = await Game.find().sort({ createdAt: -1 });
      
      return {
        success: true,
        data: games,
        count: games.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      reply.internalServerError('Failed to retrieve games: ' + error.message);
    }
  },

  // GET game by ID
  getGameById: async (request, reply) => {
    try {
      const game = await Game.findById(request.params.id);
      
      if (!game) {
        return reply.notFound('Game not found with ID: ' + request.params.id);
      }

      return {
        success: true,
        data: game,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.name === 'CastError') {
        return reply.badRequest('Invalid game ID format');
      }
      reply.internalServerError('Failed to retrieve game: ' + error.message);
    }
  },

  // POST create new game
  createGame: async (request, reply) => {
    try {
      const game = await Game.create(request.body);
      
      reply.code(201);
      return {
        success: true,
        message: 'Game created successfully',
        data: game,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return reply.badRequest('Validation failed: ' + 
          Object.values(error.errors).map(err => err.message).join(', '));
      }
      reply.internalServerError('Failed to create game: ' + error.message);
    }
  },

  // PUT update game
  updateGame: async (request, reply) => {
    try {
      const game = await Game.findById(request.params.id);
      
      if (!game) {
        return reply.notFound('Game not found with ID: ' + request.params.id);
      }

      Object.assign(game, request.body);
      await game.save();

      return {
        success: true,
        message: 'Game updated successfully',
        data: game,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        return reply.badRequest('Validation failed: ' + 
          Object.values(error.errors).map(err => err.message).join(', '));
      }
      reply.internalServerError('Failed to update game: ' + error.message);
    }
  },

  // DELETE game
  deleteGame: async (request, reply) => {
    try {
      const game = await Game.findByIdAndDelete(request.params.id);
      
      if (!game) {
        return reply.notFound('Game not found with ID: ' + request.params.id);
      }

      return {
        success: true,
        message: 'Game deleted successfully',
        deletedId: request.params.id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      reply.internalServerError('Failed to delete game: ' + error.message);
    }
  },

  // Health check
  healthCheck: async (request, reply) => {
    try {
      const gameCount = await Game.countDocuments();
      const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      return {
        success: true,
        status: 'healthy',
        message: 'Game Collection API is running',
        database: {
          type: 'MongoDB Atlas',
          status: dbStatus,
          total_games: gameCount
        },
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          node_version: process.version
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      reply.internalServerError('Database connection failed: ' + error.message);
    }
  },

  // API root
  getApiInfo: async (request, reply) => {
    return {
      success: true,
      message: '🎮 Game Collection API',
      version: '1.0.0',
      description: 'REST API for managing video game collection',
      documentation: 'All endpoints return JSON responses',
      endpoints: {
        health: {
          method: 'GET',
          path: '/api/health',
          description: 'Health check and server status'
        },
        getAllGames: {
          method: 'GET',
          path: '/api/games',
          description: 'Get all games'
        },
        getGame: {
          method: 'GET',
          path: '/api/games/:id',
          description: 'Get single game by ID'
        },
        createGame: {
          method: 'POST',
          path: '/api/games',
          description: 'Create new game',
          body: {
            title: 'string (required)',
            platform: 'string (required)',
            release_year: 'number (required)',
            price: 'number (required)',
            completed: 'boolean (optional)',
            playtime_hours: 'number (optional)'
          }
        },
        updateGame: {
          method: 'PUT',
          path: '/api/games/:id',
          description: 'Update existing game'
        },
        deleteGame: {
          method: 'DELETE',
          path: '/api/games/:id',
          description: 'Delete game by ID'
        }
      },
      timestamp: new Date().toISOString()
    };
  }
};

// Add mongoose reference
const mongoose = require('mongoose');

module.exports = gameController;