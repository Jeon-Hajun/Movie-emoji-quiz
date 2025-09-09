// src/screens/Result.jsx
import React, { useMemo, useState } from 'react';
import ScoreRegistration from './ScoreRegistration';
import Leaderboard from './Leaderboard';
import './result.css';

/** 점수 계산 규칙(프론트 전용)
 *  - 기본: 정답 1개당 +100
 *  - 속도 보너스: (120 - 소요초) 만큼 가산(최대 +120)
 *  - 패널티: 힌트 1회 -5, 패스 1회 -10
 *  ※ 필요하면 나중에 백엔드 점수 규칙으로 대체
 */
function calcScore({ correct = 0, timeUsed = 0, hintCount = 0, passCount = 0 }) {
    const base = correct * 100;
    const speed = Math.max(0, 120 - timeUsed);
    const penalty = hintCount * 5 + passCount * 10;
    return Math.max(0, base + speed - penalty);
}

export default function Result({ data, onRetry, onHome }) {
    // 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState('score-registration'); // 'score-registration' | 'leaderboard'
    const [userScore, setUserScore] = useState(null);
    const [userName, setUserName] = useState(null);

    // 페이지 네비게이션 함수들
    const goToLeaderboard = (score, name) => {
        setUserScore(score);
        setUserName(name);
        setCurrentPage('leaderboard');
    };
    const goToScoreRegistration = () => setCurrentPage('score-registration');
    const goHome = () => onHome?.();
    const goRetry = () => onRetry?.();

    // 현재 페이지에 따라 다른 컴포넌트 렌더링
    if (currentPage === 'score-registration') {
        return (
            <ScoreRegistration
                data={data}
                onBack={goHome}
                onNext={goToLeaderboard}
            />
        );
    }

    if (currentPage === 'leaderboard') {
        return (
            <Leaderboard
                onBack={goHome}
                onHome={goHome}
                userScore={userScore}
                userName={userName}
            />
        );
    }

    return null;
}
