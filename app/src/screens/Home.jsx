// src/screens/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import './home.css';

// 새 표지 이미지 import (방법 A 사용 시)
import heroImg from './images/title.jpeg';

export default function Home({ onStart }) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        if (!isHelpOpen) return;
        closeBtnRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && setIsHelpOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isHelpOpen]);

    return (
        <div className="page page--home">
            <main className="canvas canvas--home">
                {/* 헤더 */}
                <header className="home-head">
                    <h1 className="title">이모지 영화 퀴즈</h1>
                    <p className="sub">이모지 조합을 보고 영화 제목을 맞혀보세요!</p>
                </header>

                {/* 중앙 표지 이미지 (사각형, 가로로 크게) */}
                <section className="hero-wrap">
                    <img
                        src={heroImg} // 방법 B를 쓰면 "/assets/cover/hero.jpg"
                        alt="이모지 영화 퀴즈 표지"
                        className="hero-photo"
                    />
                </section>

                {/* 버튼 */}
                <div className="cta-row">
                    <button type="button" className="btn btn--lg btn--primary" onClick={onStart}>
                        시작하기
                    </button>
                    <button type="button" className="btn btn--lg btn--secondary" onClick={() => setIsHelpOpen(true)}>
                        설명보기
                    </button>
                </div>
            </main>

            {/* 설명 모달 (기능 동일) */}
            {isHelpOpen && (
                <div className="modal-backdrop" onClick={() => setIsHelpOpen(false)}>
                    <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">게임 설명</h2>
                        <div className="modal-body">
                            <ol className="help-list">
                                <li>화면의 이모지 조합을 보고 영화 제목을 입력합니다.</li>
                                <li>정답/힌트/패스, 타이머는 게임 화면에서 동작합니다.</li>
                                <li>점수 규칙은 게임 시작 후 안내됩니다.</li>
                            </ol>
                        </div>
                        <div className="modal-actions">
                            <button ref={closeBtnRef} className="btn btn--primary" onClick={() => setIsHelpOpen(false)}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
