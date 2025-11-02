import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  // ------------------
  // 상태 변수 (State)
  // ------------------

  // 현재 모드 ('focus' 또는 'break')
  const [mode, setMode] = useState('focus');
  // 집중 시간 (초 단위, 기본값 25분)
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  // 휴식 시간 (초 단위, 기본값 5분)
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  // 남은 시간 (초 단위)
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  // 타이머 실행 여부
  const [isRunning, setIsRunning] = useState(false);

  // ------------------
  // 파생 상태 (Derived State)
  // ------------------

  // 현재 모드에 따른 전체 시간
  const totalDuration = mode === 'focus' ? focusDuration : breakDuration;
  // 진행률 (0-100%)
  const progress = (timeLeft / totalDuration) * 100;

  // ------------------
  // 타이머 로직 (useEffect)
  // ------------------

  useEffect(() => {
    let interval = null;

    // 타이머가 실행 중이고 시간이 남아있을 때
    if (isRunning && timeLeft > 0) {
      // 1초마다 timeLeft를 1씩 감소
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) { // 시간이 다 되었을 때
      // 모드 전환
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(breakDuration);
      } else {
        setMode('focus');
        setTimeLeft(focusDuration);
      }
      // 타이머 자동 정지
      setIsRunning(false);
    }

    // 컴포넌트가 언마운트되거나, useEffect가 다시 실행되기 전에 인터벌 정리
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, focusDuration, breakDuration]);

  // ------------------
  // 헬퍼 함수 (Helper Functions)
  // ------------------

  // 초를 MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 타이머 시작
  const startTimer = () => setIsRunning(true);
  // 타이머 일시정지
  const pauseTimer = () => setIsRunning(false);
  // 타이머 리셋
  const resetTimer = () => {
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(focusDuration);
  };

  // ------------------
  // 원형 프로그레스 바 계산
  // ------------------

  const radius = 80; // 원의 반지름
  const circumference = 2 * Math.PI * radius; // 원의 둘레
  // 진행률에 따라 채워질 부분의 길이 계산
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // ------------------
  // 렌더링 (JSX)
  // ------------------

  return (
    <div className="timer-container">
      {/* 현재 모드 표시 */}
      <div className="mode-display">{mode === 'focus' ? 'Focus' : 'Break'}</div>

      {/* 원형 프로그레스 바와 타이머 시간 표시 */}
      <div className="progress-ring">
        <svg width="200" height="200">
          {/* 프로그레스 바 배경 트랙 */}
          <circle
            stroke="#3a3a5a"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
          {/* 프로그레스 바 진행 상태 표시 */}
          <circle
            stroke="#007bff"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
            style={{
              strokeDasharray: circumference, // 원의 둘레만큼 대시 설정
              strokeDashoffset: strokeDashoffset, // 진행률에 따라 대시 오프셋 조절
              transform: 'rotate(-90deg)', // 시작점을 위쪽으로 이동
              transformOrigin: '50% 50%', // 회전 중심 설정
              transition: 'stroke-dashoffset 0.5s linear' // 부드러운 전환 효과
            }}
          />
        </svg>
        {/* 남은 시간 표시 */}
        <div className="timer-display">{formatTime(timeLeft)}</div>
      </div>

      {/* 타이머 조작 버튼 */}
      <div className="timer-controls">
        {/* 실행 중이 아닐 때는 Start 버튼, 실행 중일 때는 Pause 버튼 표시 */}
        {!isRunning ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={pauseTimer}>Pause</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Timer;