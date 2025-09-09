const pool = require('../config/dbPool');

// DB에서 랜덤으로 10문제 가져오기
exports.getQuizList = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, emoji, answer, poster, hint FROM quiz ORDER BY RAND() LIMIT 100');
        res.json(rows); // 프론트에서 순차적으로 문제 표시
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 조회 오류' });
    }
};
