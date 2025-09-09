const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// 점수 저장
router.post('/', scoreController.saveScore);

// 리더보드 조회
router.get('/leaderboard', scoreController.getLeaderboard);

module.exports = router;
