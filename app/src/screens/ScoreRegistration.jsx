// src/screens/ScoreRegistration.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { saveScore } from '../api/Api';
import './score-registration.css';

export default function ScoreRegistration({ data, onBack, onNext }) {
    // data: {correct, total, timeUsed, hintCount, passCount}
    const myScore = useMemo(() => {
        const base = (data?.correct || 0) * 100;
        const speed = Math.max(0, 120 - (data?.timeUsed || 0));
        const penalty = (data?.hintCount || 0) * 5 + (data?.passCount || 0) * 10;
        return Math.max(0, base + speed - penalty);
    }, [data]);

    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const nameRef = useRef(null);

    useEffect(() => {
        // 닉네임 입력 바로 포커스
        setTimeout(() => nameRef.current?.focus(), 50);
    }, []);

    // 제출(랭킹 등록)
    const submit = (e) => {
        e?.preventDefault?.();
        const trimmed = (name || '').trim();
        if (!trimmed || submitted) return;
        (async () => {
            try {
                setSubmitting(true);
                setSubmitted(true);
                setError('');
                setSuccess('');
                await saveScore(trimmed, myScore);
                setSuccess('점수가 성공적으로 등록되었습니다!');
                setName('');
                // 2초 후 리더보드 페이지로 이동
                setTimeout(() => {
                    onNext?.(myScore, trimmed);
                }, 2000);
            } catch (err) {
                console.error('점수 저장 실패:', err);
                setError('점수 저장에 실패했습니다. 잠시 후 다시 시도하세요.');
                setSubmitted(false);
            } finally {
                setSubmitting(false);
            }
        })();
    };

    const mmss = (sec) => {
        const m = String(Math.floor(sec / 60));
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="page page--score-registration">
            <main className="canvas canvas--score-registration">
                {/* 상단 헤더 */}
                <header className="score-header">
                    <h2 className="title">점수 등록</h2>
                    <p className="sub">닉네임을 입력하여 랭킹에 등록하세요</p>
                </header>

                {/* 내 결과 카드 */}
                <section className="mycard">
                    <div className="stat">
                        <div className="label">정답</div>
                        <div className="value">
                            {data?.correct ?? 0} / {data?.total ?? 0}
                        </div>
                    </div>
                    <div className="stat">
                        <div className="label">소요시간</div>
                        <div className="value">{mmss(data?.timeUsed ?? 0)}</div>
                    </div>
                    <div className="stat">
                        <div className="label">힌트/패스</div>
                        <div className="value">
                            {data?.hintCount ?? 0} / {data?.passCount ?? 0}
                        </div>
                    </div>
                    <div className="stat highlight">
                        <div className="label">점수</div>
                        <div className="value big">{myScore}</div>
                    </div>
                </section>

                {/* 점수 등록 폼 */}
                <section className="registration-form">
                    <form className="reg-form" onSubmit={submit}>
                        <div className="nickname-input-row">
                            <label htmlFor="nickname" className="nickname-label">
                                닉네임
                            </label>
                            <div className="nickname-input-container">
                                <input
                                    ref={nameRef}
                                    id="nickname"
                                    type="text"
                                    className="nick-input"
                                    placeholder="닉네임을 입력하세요 (예: popcorn123)"
                                    maxLength={20}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={submitting || submitted}
                                />
                            </div>
                            <button type="submit" className="btn btn--primary nickname-register-btn" disabled={submitting || submitted}>
                                {submitting ? '등록 중...' : submitted ? '등록 완료' : '랭킹 등록'}
                            </button>
                        </div>
                    </form>
                    {error && <p className="message error">{error}</p>}
                    {success && <p className="message success">{success}</p>}
                </section>

                {/* 하단 버튼 */}
                <section className="actions">
                    <button className="btn btn--secondary" onClick={onBack}>
                        홈으로
                    </button>
                    <button className="btn btn--ghost" onClick={() => onNext?.(myScore, name.trim())}>
                        리더보드 보기
                    </button>
                </section>
            </main>
        </div>
    );
}
