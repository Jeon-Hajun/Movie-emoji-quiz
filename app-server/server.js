const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRouter = require('./src/routes/quizRouter');
const scoreRouter = require('./src/routes/scoreRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// 정적 파일 서빙
app.use('/poster', express.static(path.join(__dirname, 'poster')));
app.use(express.static(path.join(__dirname, 'public'))); // 프론트엔드 빌드 파일

// API 라우터
app.use('/api/quiz', quizRouter);
app.use('/api/score', scoreRouter);

// 프론트엔드 라우팅을 위한 fallback
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/poster/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 영화 포스터 퀴즈 게임 서버가 시작되었습니다!`);
    console.log(`🌐 서버 주소: http://localhost:${PORT}`);
    console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
});
