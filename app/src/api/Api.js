// 환경에 따른 API 베이스 URL 설정
const API_BASE = import.meta.env.VITE_API_URL || 
                 (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');

export { API_BASE };

// 퀴즈 리스트 가져오기
export const getQuizList = async () => {
    const res = await fetch(`${API_BASE}/api/quiz/list`);
    if (!res.ok) throw new Error('퀴즈 데이터를 불러올 수 없습니다');
    return res.json();
};

// 점수 저장
export const saveScore = async (name, score) => {
    const res = await fetch(`${API_BASE}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
    });
    if (!res.ok) throw new Error('점수 저장에 실패했습니다');
    return res.json();
};

// 리더보드 가져오기 (limit으로 개수 조절, 기본: 1000)
export const getLeaderboard = async (limit = 1000) => {
    const res = await fetch(`${API_BASE}/api/score/leaderboard?limit=${encodeURIComponent(limit)}`);
    if (!res.ok) throw new Error('리더보드를 불러올 수 없습니다');
    return res.json();
};
