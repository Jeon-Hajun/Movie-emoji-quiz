// src/screens/Play.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getQuizList } from '../api/Api';
import './play.css';

/** 초성 변환 */
function toChosung(str) {
    const CHO = [
        'ㄱ',
        'ㄲ',
        'ㄴ',
        'ㄷ',
        'ㄸ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅃ',
        'ㅅ',
        'ㅆ',
        'ㅇ',
        'ㅈ',
        'ㅉ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ',
    ];
    const BASE = 0xac00,
        CHO_UNIT = 588;
    return Array.from(str || '')
        .map((ch) => {
            const code = ch.charCodeAt(0);
            if (code >= 0xac00 && code <= 0xd7a3) {
                const i = Math.floor((code - BASE) / CHO_UNIT);
                return CHO[i];
            }
            if (/\s/.test(ch)) return ' ';
            return '·';
        })
        .join('');
}
const normalize = (s) => (s || '').replace(/\s+/g, '').toLowerCase();

/** 서버 데이터 로딩 보조: 이모지 문자열을 카드 배열로 변환 */
// 이모지 판별(확장 픽토그래픽, 변형 선택자, 키캡, 국기 등 포함)
function isEmoji(grapheme) {
    try {
        if (!grapheme) return false;
        const hasExt = /\p{Extended_Pictographic}/u.test(grapheme);
        const hasVS = /\uFE0F/.test(grapheme);
        const hasZWJ = /\u200D/.test(grapheme);
        const isKeycap = /[0-9#*]\uFE0F?\u20E3/u.test(grapheme);
        const isFlag = /\p{Regional_Indicator}{2}/u.test(grapheme);
        return hasExt || hasVS || hasZWJ || isKeycap || isFlag;
    } catch {
        return true; // 구형 브라우저에선 필터링을 완화
    }
}

const toEmojiArray = (emojiString) => {
    const raw = (emojiString || '').trim();
    if (!raw) return [];
    // 조합을 깨지 않기 위해 ZWJ(200D)와 VS(FE0F)는 유지, ZWNJ(200C)만 제거
    const INVISIBLES = /[\u200C]/g;
    const cleaned = raw.replace(INVISIBLES, '');
    // grapheme 단위 분할 (지원 시)
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter !== 'undefined') {
        const seg = new Intl.Segmenter('ko', { granularity: 'grapheme' });
        return [...seg.segment(cleaned)]
            .map((s) => s.segment)
            .filter((g) => g && g.trim() !== '')
            .filter((g) => isEmoji(g));
    }
    // 폴백: Array.from
    return Array.from(cleaned)
        .filter((g) => g && g.trim() !== '')
        .filter((g) => isEmoji(g));
};

export default function Play({ onExit, onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [qIdx, setQIdx] = useState(0);
    const q = questions[qIdx];

    // 진행/점수 관련
    const [correct, setCorrect] = useState(0);
    const [hintCount, setHintCount] = useState(0);
    const [passCount, setPassCount] = useState(0);

    // 입력/상태
    const [guess, setGuess] = useState('');
    const [hintUsed, setHintUsed] = useState(false);
    const [hintText, setHintText] = useState('');
    const [message, setMessage] = useState('');

    // 타이머(총 2분)
    const [secondsLeft, setSecondsLeft] = useState(120);
    const timeUp = secondsLeft <= 0;

    // 종료 플래그
    const [finished, setFinished] = useState(false);

    const inputRef = useRef(null);

    // 퀴즈 불러오기
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const list = await getQuizList();
                if (!mounted) return;
                const mapped = (list || []).map((row, i) => ({
                    id: row.id ?? i,
                    answer: row.answer ?? '',
                    // 문제당 정확히 7개만 노출
                    emojis: toEmojiArray(row.emoji).slice(0, 7),
                }));
                setQuestions(mapped);
                setQIdx(0);
                setLoadError('');
            } catch (e) {
                setLoadError('퀴즈를 불러오지 못했습니다. 잠시 후 다시 시도하세요.');
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // 타이머 틱
    useEffect(() => {
        if (timeUp || finished) return;
        const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [timeUp, finished]);

    const mmss = useMemo(() => {
        const m = String(Math.floor(secondsLeft / 60));
        const s = String(secondsLeft % 60).padStart(2, '0');
        return `${m}:${s}`;
    }, [secondsLeft]);

    // 공통: 다음 문제로
    const gotoNext = () => {
        if (qIdx < questions.length - 1) {
            setQIdx((i) => i + 1);
            setGuess('');
            setHintUsed(false);
            setHintText('');
            setMessage('');
            inputRef.current?.focus();
        } else {
            setFinished(true);
        }
    };

    // 힌트
    const showHint = () => {
        if (hintUsed || timeUp || finished) return;
        setHintUsed(true);
        setHintText(toChosung(q.answer));
        setHintCount((c) => c + 1);
        setMessage('초성 힌트를 사용했습니다.');
    };

    // 제출
    const submit = (e) => {
        e?.preventDefault?.();
        if (timeUp || finished || !guess.trim()) return;
        if (normalize(guess) === normalize(q.answer)) {
            setCorrect((c) => c + 1);
            gotoNext();
        } else {
            setMessage('오답입니다. 다시 시도해보세요.');
            inputRef.current?.focus();
        }
    };

    // 패스
    const pass = () => {
        if (timeUp || finished) return;
        setPassCount((c) => c + 1);
        setMessage('패스했습니다.');
        gotoNext();
    };

    // 종료 시 결과 화면으로 이동 버튼이 눌리면 onFinish 호출
    const goResult = () => {
        const payload = {
            correct,
            total: questions.length,
            timeUsed: 120 - secondsLeft, // 소요시간
            hintCount,
            passCount,
        };
        onFinish?.(payload);
    };

    return (
        <div className="page page--play">
            <main className="canvas canvas--play">
                {/* 상단바 */}
                <header className="play-topbar">
                    <div className="left">
                        <span className="badge">
                            문제 {qIdx + 1} / {questions.length}
                        </span>
                    </div>
                    <div className={`timer ${secondsLeft <= 10 ? 'danger' : ''}`} aria-live="polite">
                        ⏱ {mmss}
                    </div>
                    <div className="right">
                        <button className="btn btn--ghost" onClick={onExit}>
                            나가기
                        </button>
                    </div>
                </header>

                {/* 이모지 영역 */}
                <section className="emoji-board">
                    <div className="emoji-grid">
                        {loading && <div className="emoji-empty">불러오는 중…</div>}
                        {loadError && !loading && <div className="emoji-empty">{loadError}</div>}
                        {!loading && !loadError && q?.emojis?.length ? (
                            q.emojis.map((em, i) => (
                                <div className="emoji-card" key={i} aria-label={`emoji-${i + 1}`}>
                                    <span style={{ fontSize: '2rem' }}>{em}</span>
                                </div>
                            ))
                        ) : (
                            !loading && !loadError && <div className="emoji-empty">이모지가 없습니다</div>
                        )}
                    </div>
                </section>

                {/* 입력/버튼 */}
                <section className="answer-area">
                    <form className="answer-form" onSubmit={submit}>
                        <input
                            ref={inputRef}
                            className="answer-input"
                            type="text"
                            placeholder="영화 제목을 입력하세요"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            disabled={timeUp || finished}
                        />
                        <div className="actions">
                            <button type="submit" className="btn btn--primary" disabled={timeUp || finished}>
                                제출
                            </button>
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={showHint}
                                disabled={hintUsed || timeUp || finished}
                            >
                                힌트
                            </button>
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={pass}
                                disabled={timeUp || finished}
                            >
                                패스
                            </button>
                        </div>
                    </form>

                    <div className="hint-row">
                        {hintUsed ? (
                            <div className="hint-badge" aria-live="polite">
                                초성: {hintText}
                            </div>
                        ) : (
                            <div className="hint-badge hint-muted">힌트를 누르면 초성이 표시됩니다</div>
                        )}
                        {message && (
                            <div className="msg" role="status">
                                {message}
                            </div>
                        )}
                    </div>
                </section>

                {/* 종료(시간 종료 or 모든 문제 완료) → 결과 보기 */}
                {(timeUp || finished) && (
                    <div className="timeup">
                        <div className="timeup-card">
                            <div className="timeup-title">{timeUp ? '시간 종료' : '라운드 종료'}</div>
                            <div className="timeup-actions">
                                <button className="btn btn--secondary" onClick={onExit}>
                                    홈으로
                                </button>
                                <button className="btn btn--primary" onClick={goResult}>
                                    결과 보기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
