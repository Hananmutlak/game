const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./models');
const gameRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const { Game } = require('./models');
    const gameCount = await Game.count();
    
    res.json({
      status: 'OK',
      message: 'Game Collection API is running',
      database: 'SQLite',
      total_games: gameCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found - Available routes: GET /api/games, GET /api/games/:id, POST /api/games, PUT /api/games/:id, DELETE /api/games/:id'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api`);
      console.log(`🗄️ Database: SQLite (database.sqlite)`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();