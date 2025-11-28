const { Game } = require('../models');

// الحصول على جميع الألعاب
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: games,
      count: games.length
    });
  } catch (error) {
    console.error('Get all games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve games',
      error: error.message
    });
  }
};

// الحصول على لعبة محددة
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Get game by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve game',
      error: error.message
    });
  }
};

// إنشاء لعبة جديدة
exports.createGame = async (req, res) => {
  try {
    const { title, platform, release_year, price, completed = false, playtime_hours = 0 } = req.body;

    const game = await Game.create({
      title,
      platform,
      release_year,
      price,
      completed,
      playtime_hours
    });

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game
    });
  } catch (error) {
    console.error('Create game error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Game already exists',
        errors: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create game',
      error: error.message
    });
  }
};

// تحديث لعبة
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    await game.update(req.body);

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: game
    });
  } catch (error) {
    console.error('Update game error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update game',
      error: error.message
    });
  }
};

// حذف لعبة
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    await game.destroy();

    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete game',
      error: error.message
    });
  }
};