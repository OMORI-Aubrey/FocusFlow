import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  // ------------------
  // 상태 변수 (State)
  // ------------------

  const [mode, setMode] = useState('focus');
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [isRunning, setIsRunning] = useState(false);

  // ------------------
  // 파생 상태 (Derived State)
  // ------------------

  const totalDuration = mode === 'focus' ? focusDuration : breakDuration;
  const progress = (timeLeft / totalDuration) * 100;

  // ------------------
  // 타이머 로직 (useEffect)
  // ------------------

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(breakDuration);
      } else {
        setMode('focus');
        setTimeLeft(focusDuration);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, focusDuration, breakDuration]);

  // ------------------
  // 헬퍼 함수 (Helper Functions)
  // ------------------

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(focusDuration);
  };

  // ------------------
  // 원형 프로그레스 바 계산
  // ------------------

  const radius = 180; // 원의 반지름 (크기 증가)
  const strokeWidth = 15; // 선 두께 증가
  const circumference = 2 * Math.PI * radius; // 원의 둘레
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // ------------------
  // 렌더링 (JSX)
  // ------------------

  return (
    <div className="timer-container">
      <div className="mode-display">{mode === 'focus' ? 'Focus' : 'Break'}</div>

      <div className="progress-ring">
        <svg width="400" height="400">
          <circle
            stroke="#2a2a4a" // 트랙 색상 변경
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="200"
            cy="200"
          />
          <circle
            stroke="#007bff" // 진행률 색상 변경
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="200"
            cy="200"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              transition: 'stroke-dashoffset 0.5s linear',
              strokeLinecap: 'round' // 선 끝을 둥글게
            }}
          />
        </svg>
        <div className="timer-display">{formatTime(timeLeft)}</div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="start-pause-btn" onClick={startTimer}>Start</button>
        ) : (
          <button className="start-pause-btn" onClick={pauseTimer}>Pause</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;
