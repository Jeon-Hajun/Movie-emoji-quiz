// src/App.jsx
import React, { useState } from 'react';
import Home from './screens/Home.jsx';
import Play from './screens/Play.jsx';
import Result from './screens/Result.jsx';

export default function App() {
    // 'home' | 'play' | 'result'
    const [screen, setScreen] = useState('home');
    const [resultData, setResultData] = useState(null);

    if (screen === 'home') {
        return <Home onStart={() => setScreen('play')} />;
    }

    if (screen === 'play') {
        return (
            <Play
                onExit={() => setScreen('home')}
                onFinish={(data) => {
                    setResultData(data);
                    setScreen('result');
                }}
            />
        );
    }

    // 결과/랭킹
    return (
        <Result
            data={resultData}
            onHome={() => setScreen('home')}
            onRetry={() => {
                setResultData(null);
                setScreen('play');
            }}
        />
    );
}
