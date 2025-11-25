const Game = require('../models/Game');

// التحقق من صحة البيانات
const validateGame = (gameData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || gameData.title !== undefined) {
    if (!gameData.title || typeof gameData.title !== 'string' || gameData.title.length > 255) {
      errors.push('Title is required and must be a string (max 255 characters)');
    }
  }

  if (!isUpdate || gameData.platform !== undefined) {
    if (!gameData.platform || typeof gameData.platform !== 'string' || gameData.platform.length > 100) {
      errors.push('Platform is required and must be a string (max 100 characters)');
    }
  }

  if (!isUpdate || gameData.release_year !== undefined) {
    const currentYear = new Date().getFullYear();
    if (!gameData.release_year || 
        typeof gameData.release_year !== 'number' || 
        gameData.release_year < 1950 || 
        gameData.release_year > currentYear + 2) {
      errors.push(`Release year must be a number between 1950 and ${currentYear + 2}`);
    }
  }

  if (!isUpdate || gameData.price !== undefined) {
    if (!gameData.price || typeof gameData.price !== 'number' || gameData.price < 0) {
      errors.push('Price is required and must be a positive number');
    }
  }

  if (gameData.completed !== undefined && typeof gameData.completed !== 'boolean') {
    errors.push('Completed must be a boolean value');
  }

  if (gameData.playtime_hours !== undefined && 
      (typeof gameData.playtime_hours !== 'number' || gameData.playtime_hours < 0)) {
    errors.push('Playtime hours must be a positive number');
  }

  return errors;
};

// الحصول على جميع الألعاب
exports.getAllGames = (req, res) => {
  try {
    const games = Game.findAll();
    res.json({
      success: true,
      data: games,
      count: games.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve games',
      error: error.message
    });
  }
};

// الحصول على لعبة محددة
exports.getGameById = (req, res) => {
  try {
    const game = Game.findById(req.params.id);
    
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
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve game',
      error: error.message
    });
  }
};

// إنشاء لعبة جديدة
exports.createGame = (req, res) => {
  try {
    const validationErrors = validateGame(req.body);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const newGame = Game.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: newGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create game',
      error: error.message
    });
  }
};

// تحديث لعبة
exports.updateGame = (req, res) => {
  try {
    const game = Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const validationErrors = validateGame(req.body, true);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const updatedGame = Game.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: updatedGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update game',
      error: error.message
    });
  }
};

// حذف لعبة
exports.deleteGame = (req, res) => {
  try {
    const game = Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const deleted = Game.delete(req.params.id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Game deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete game'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete game',
      error: error.message
    });
  }
};