const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// DB 연동 랜덤 퀴즈 API
router.get('/list', quizController.getQuizList);

module.exports = router;
