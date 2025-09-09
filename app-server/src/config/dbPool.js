const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost', // MySQL 서버 주소
    user: 'root', // MySQL 유저명 (Workbench 로그인 계정)
    password: '1q2w3e4r', // MySQL 유저 비밀번호
    database: 'quiz_app', // 사용할 DB 이름
    waitForConnections: true,
    connectionLimit: 10, // 동시에 최대 연결 수
    queueLimit: 0,
});

module.exports = pool;
