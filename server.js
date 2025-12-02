// server.js
require('dotenv').config();
const fastify = require('fastify')({ 
  logger: true 
});
const cors = require('@fastify/cors');
const sensible = require('@fastify/sensible');

// Import database
const connectDB = require('./config/database');

// Import routes
const gameRoutes = require('./routes/gameRoutes');

// Register plugins
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false
});

fastify.register(sensible);

// Register routes
fastify.register(gameRoutes);

// Root route - GET /
fastify.get('/', async (request, reply) => {
  return {
    success: true,
    message: 'Welcome to Game Collection API',
    version: '1.0.0',
    documentation: 'Visit /api for all available endpoints',
    endpoints: {
      api_info: 'GET /api',
      health_check: 'GET /api/health',
      get_all_games: 'GET /api/games',
      get_single_game: 'GET /api/games/:id',
      create_game: 'POST /api/games',
      update_game: 'PUT /api/games/:id',
      delete_game: 'DELETE /api/games/:id'
    },
    status: 'running',
    timestamp: new Date().toISOString()
  };
});

// 404 handler
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    error: 'Route not found',
    message: `The route ${request.method} ${request.url} was not found on this server`,
    availableRoutes: [
      'GET /',
      'GET /api',
      'GET /api/health',
      'GET /api/games',
      'GET /api/games/:id',
      'POST /api/games',
      'PUT /api/games/:id',
      'DELETE /api/games/:id'
    ],
    timestamp: new Date().toISOString()
  });
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500;
  
  fastify.log.error(error);
  
  reply.code(statusCode).send({
    success: false,
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');
  
  try {
    await fastify.close();
    console.log('Fastify server closed');
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    console.log('Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);

// Start server
const start = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ 
      port: PORT, 
      host: HOST 
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('GAME COLLECTION API');
    console.log('='.repeat(60));
    
    console.log('\nServer Information:');
    console.log('   Local:      http://localhost:' + PORT);
    console.log('   Network:    http://' + HOST + ':' + PORT);
    
    console.log('\nAPI Endpoints:');
    console.log('   API Info:      http://localhost:' + PORT + '/api');
    console.log('   Health Check:  http://localhost:' + PORT + '/api/health');
    console.log('   Games API:     http://localhost:' + PORT + '/api/games');
    
    console.log('\nTechnical Details:');
    console.log('   Database:      MongoDB Atlas');
    console.log('   Framework:     Fastify ' + fastify.version);
    console.log('   Environment:   ' + (process.env.NODE_ENV || 'development'));
    
    console.log('\n' + '-'.repeat(60));
    
    console.log('\nAvailable Routes:');
    console.log('   GET     /                    - Welcome page');
    console.log('   GET     /api                 - API information');
    console.log('   GET     /api/health          - Health check');
    console.log('   GET     /api/games           - Get all games');
    console.log('   POST    /api/games           - Create new game');
    console.log('   GET     /api/games/:id       - Get single game');
    console.log('   PUT     /api/games/:id       - Update game');
    console.log('   DELETE  /api/games/:id       - Delete game');
    
    console.log('\n' + '='.repeat(60));
    console.log('Server is ready! Press Ctrl+C to stop.');
    console.log('='.repeat(60) + '\n');
    
    console.log('Tip: Test the API with:');
    console.log('   curl http://localhost:' + PORT + '/api/health');
    console.log('   curl http://localhost:' + PORT + '/api/games\n');
    
  } catch (err) {
    console.error('\nServer startup error:', err.message);
    
    if (err.code === 'EADDRINUSE') {
      console.error('   Port ' + (process.env.PORT || 3000) + ' is already in use.');
      console.error('   Try changing the PORT in your .env file.');
    }
    
    if (err.message.includes('Mongo')) {
      console.error('   MongoDB connection failed.');
      console.error('   Check your MONGODB_URI in the .env file.');
    }
    
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  start();
} else {
  module.exports = fastify;
}