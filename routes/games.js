const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// GET /api/games - الحصول على جميع الألعاب
router.get('/', gameController.getAllGames);

// GET /api/games/:id - الحصول على لعبة محددة
router.get('/:id', gameController.getGameById);

// POST /api/games - إنشاء لعبة جديدة
router.post('/', gameController.createGame);

// PUT /api/games/:id - تحديث لعبة
router.put('/:id', gameController.updateGame);

// DELETE /api/games/:id - حذف لعبة
router.delete('/:id', gameController.deleteGame);

module.exports = router;