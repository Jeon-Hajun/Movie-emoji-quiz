const pool = require('../config/dbPool');

// 점수 저장 (모든 기록 저장, 기록 번호 자동 생성)
exports.saveScore = async (req, res) => {
    const { name, score } = req.body;

    if (!name || score == null) {
        return res.status(400).json({ message: '이름과 점수 필요' });
    }

    try {
        // 같은 이름의 기존 기록 개수 확인하여 기록 번호 생성
        const [existing] = await pool.query('SELECT COUNT(*) as count FROM score WHERE name = ?', [name]);
        const recordNumber = existing[0].count + 1;
        
        // 새로운 기록 저장
        const [result] = await pool.query('INSERT INTO score (name, score, record_number) VALUES (?, ?, ?)', [name, score, recordNumber]);
        res.json({ 
            message: '점수 저장 완료', 
            id: result.insertId,
            recordNumber: recordNumber,
            totalRecords: recordNumber
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 저장 오류' });
    }
};

// 리더보드 조회
exports.getLeaderboard = async (req, res) => {
    const limit = req.query.limit || 10; // 상위 10명 기본
    try {
        // 각 플레이어의 최고 점수만 조회
        const [rows] = await pool.query(`
            SELECT name, MAX(score) as score
            FROM score
            GROUP BY name
            ORDER BY score DESC
            LIMIT ?
        `, [parseInt(limit)]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '리더보드 조회 오류' });
    }
};
