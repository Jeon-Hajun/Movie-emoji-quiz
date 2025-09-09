// src/screens/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/Api';
import './leaderboard.css';

export default function Leaderboard({ onBack, onHome }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 리더보드 불러오기 함수
    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const list = await getLeaderboard();
            setEntries(Array.isArray(list) ? list : []);
            setError('');
        } catch (e) {
            console.error('리더보드 불러오기 실패:', e);
            setError('리더보드를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const top10 = entries.slice(0, 10);

    return (
        <div className="page page--leaderboard">
            <main className="canvas canvas--leaderboard">
                {/* 상단 헤더 */}
                <header className="leaderboard-header">
                    <h2 className="title">리더보드</h2>
                    <p className="sub">상위 10명의 최고 점수를 확인하세요</p>
                </header>

                {/* 새로고침 버튼 */}
                <section className="refresh-section">
                    <button 
                        className="btn btn--secondary btn--small" 
                        onClick={loadLeaderboard}
                        disabled={loading}
                    >
                        {loading ? '새로고침 중...' : '새로고침'}
                    </button>
                </section>

                {/* 리더보드 테이블 */}
                <section className="leaderboard-table">
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                            <button className="btn btn--primary" onClick={loadLeaderboard}>
                                다시 시도
                            </button>
                        </div>
                    )}
                    
                    {loading && !error && (
                        <div className="loading-message">
                            <p>리더보드를 불러오는 중...</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="table">
                            <div className="row header">
                                <div className="col rank">순위</div>
                                <div className="col name">닉네임</div>
                                <div className="col score">점수</div>
                            </div>
                            {top10.length ? (
                                top10.map((r, i) => {
                                    const rank = i + 1;
                                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                                    return (
                                        <div key={`${r.name}-${i}`} className={`row ${rank <= 3 ? 'podium' : ''}`}>
                                            <div className="col rank">
                                                {rank <= 3 ? (
                                                    <span className="medal">{medal}</span>
                                                ) : (
                                                    <span className="rank-number">{rank}</span>
                                                )}
                                            </div>
                                            <div className="col name">{r.name}</div>
                                            <div className="col score">{r.score.toLocaleString()}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="row empty">
                                    <div className="empty-message">
                                        <p>아직 등록된 기록이 없습니다.</p>
                                        <p>첫 번째 기록을 만들어보세요!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 하단 버튼 */}
                <section className="actions">
                    <button className="btn btn--secondary" onClick={onBack}>
                        이전으로
                    </button>
                    <button className="btn btn--primary" onClick={onHome}>
                        홈으로
                    </button>
                </section>
            </main>
        </div>
    );
}
