import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Timer.jsx (수정본)
 *
 * 주요 변경점:
 * - Settings 패널: label(시간/분/초) 상단, 입력란은 아래만 밑줄(언더라인)으로 변경
 * - 입력 시 즉시 타이머(timeLeft)에 반영되도록 useEffect 연결
 * - 화살표(증감) 버튼을 오른쪽에 통합된 블록 형태로 재디자인
 * - 입력값 NaN 방지 및 범위(clamp) 적용
 */

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  // timeLeft는 밀리초 단위
  const [timeLeft, setTimeLeft] = useState(() => (hours * 3600 + minutes * 60 + seconds) * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("minutes");
  const [inputValue, setInputValue] = useState("");
  const inputTimeoutRef = useRef(null);

  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  // animate wave when running
  useEffect(() => {
    const animate = () => {
      setWaveOffset((prev) => (prev + 1) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // Timer ticking - use 1s or 50ms step? keep 50ms smoothness as original
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 50) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 50;
        });
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Helper: clamp values
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // When hours/minutes/seconds change, immediately update timeLeft (live preview)
  useEffect(() => {
    const totalMilliseconds = (Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(seconds || 0)) * 1000;
    setTimeLeft(totalMilliseconds);
    // stop running while user edits
    setIsRunning(false);
    setIsComplete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes, seconds]);

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    const total = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTimeLeft(total);
  };

  // display values from timeLeft
  const displayHours = Math.floor(timeLeft / 3600000);
  const displayMinutes = Math.floor((timeLeft % 3600000) / 60000);
  const displaySeconds = Math.floor((timeLeft % 60000) / 1000);

  const totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  // Input change handlers that guard against NaN and apply clamps
  const onHoursChange = (value) => {
    const n = parseInt(value);
    setHours(isNaN(n) ? 0 : Math.max(0, n));
  };
  const onMinutesChange = (value) => {
    const n = parseInt(value);
    setMinutes(isNaN(n) ? 0 : clamp(n, 0, 59));
  };
  const onSecondsChange = (value) => {
    const n = parseInt(value);
    setSeconds(isNaN(n) ? 0 : clamp(n, 0, 59));
  };

  const handleIncrement = () => {
    if (selectedUnit === "hours") {
      incHours();
    } else if (selectedUnit === "minutes") {
      incMinutes();
    } else {
      incSeconds();
    }
  };

  const handleDecrement = () => {
    if (selectedUnit === "hours") {
      decHours();
    } else if (selectedUnit === "minutes") {
      decMinutes();
    } else {
      decSeconds();
    }
  };

  // Arrow click handlers (increment/decrement)
  const incHours = () => setHours((h) => Math.max(0, h + 1));
  const decHours = () => setHours((h) => Math.max(0, h - 1));
  const incMinutes = () => setMinutes((m) => clamp(m + 1, 0, 59));
  const decMinutes = () => setMinutes((m) => clamp(m - 1, 0, 59));
  const incSeconds = () => setSeconds((s) => clamp(s + 1, 0, 59));
  const decSeconds = () => setSeconds((s) => clamp(s - 1, 0, 59));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSettingsOpen) return;

      if (e.key >= "0" && e.key <= "9") {
        setInputValue((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setInputValue((prev) => prev.slice(0, -1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
    }

    if (inputValue) {
      inputTimeoutRef.current = setTimeout(() => {
        const newTime = parseInt(inputValue, 10);
        if (isNaN(newTime)) {
          setInputValue("");
          return;
        }

        if (selectedUnit === "hours") {
          setHours(newTime);
        } else if (selectedUnit === "minutes") {
          const overflowHours = Math.floor(newTime / 60);
          const newMinutes = newTime % 60;
          setHours((h) => h + overflowHours);
          setMinutes(newMinutes);
        } else if (selectedUnit === "seconds") {
          const overflowMinutes = Math.floor(newTime / 60);
          const newSeconds = newTime % 60;
          setSeconds(newSeconds);

          const totalMinutes = minutes + overflowMinutes;
          const overflowHours = Math.floor(totalMinutes / 60);
          const finalMinutes = totalMinutes % 60;
          setHours((h) => h + overflowHours);
          setMinutes(finalMinutes);
        }

        setInputValue("");
      }, 1000);
    }

    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [inputValue, selectedUnit, hours, minutes, seconds]);

  return (
    <div className="w-full max-w-md">
      {/* Timer Display Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-6">
        {/* Progress Circle */}
        <div className="relative mx-auto mb-6" style={{ width: "580px", height: "580px" }}>
          <svg className="w-full h-full" viewBox="0 0 256 256">
            <defs>
              {/* 타이머 진행률을 채우는 그라데이션 색상 */}
              <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFA8C5" />
                <stop offset="50%" stopColor="#C5A8FF" />
                <stop offset="100%" stopColor="#E5D4FF" />
              </linearGradient>
              {/* 타이머 배경 그라데이션 색상 */}
              <linearGradient id="gradientBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E3F2FD" />
                <stop offset="50%" stopColor="#BBDEFB" />
                <stop offset="100%" stopColor="#90CAF9" />
              </linearGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Clip path with wave effect */}
              <clipPath id="waterFill">
                <path
                  d={`
                    M 0,256
                    L 0,${256 - (256 * progress) / 100 + 5}
                    ${Array.from({ length: 30 }, (_, i) => {
                    const x = (256 / 30) * (i + 1);
                    const baseY = 256 - (256 * progress) / 100;
                    const wave1 = Math.sin((i / 30) * Math.PI * 4 + (waveOffset * Math.PI) / 180) * 4;
                    const wave2 = Math.cos((i / 30) * Math.PI * 6 + ((waveOffset * Math.PI) / 180) * 0.7) * 2;
                    return `L ${x},${baseY + wave1 + wave2}`;
                  }).join(" ")}
                    L 256,${256 - (256 * progress) / 100 + 5}
                    L 256,256
                    L 0,256
                    Z
                  `}
                />
              </clipPath>
            </defs>

            {/* 타이머 배경 원 색상 */}
            <circle cx="128" cy="128" r="110" fill="url(#gradientBg)" />

            {/* 타이머 진행률을 채우는 원 색상 */}
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="url(#fillGradient)"
              clipPath="url(#waterFill)"
              className="transition-all duration-1000 ease-in-out"
            />

            {/* 타이머 테두리 색상 */}
            <circle cx="128" cy="128" r="110" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />

            {/* 타이머 시간 텍스트 색상 */}
            <text
              x="128"
              y="128"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="40"
              fill="white"
              fontFamily="monospace"
              filter="url(#softGlow)"
            >
              {String(displayHours).padStart(2, "0")}:{String(displayMinutes).padStart(2, "0")}:
              {String(displaySeconds).padStart(2, "0")}
            </text>
            {isComplete && (
              <text
                x="128"
                y="180"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="white"
                fontFamily="monospace"
                filter="url(#softGlow)"
                className="animate-pulse"
              >
                Complete!
              </text>
            )}
          </svg>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <AnimatePresence mode="wait">
            {!isSettingsOpen ? (
              <motion.div
                key="timer-controls"
                className="flex items-center justify-center"
                style={{ marginTop: "-1rem" }}
                initial={{ opacity: 0, x: -50, y: -16 }}
                animate={{ opacity: 1, x: 0, y: -16 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <motion.button
                  layout
                  onClick={isRunning ? handlePause : handleStart}
                  // "Start" 버튼 배경색 (그라데이션)
                  className="rounded-2xl bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-none select-none"
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "일시중지" : "시작"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-3xl drop-shadow-lg text-white"
                      // "Start" 버튼 텍스트 색상
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {isRunning ? "일시중지" : "시작"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <div style={{ width: "1rem" }} />

                <motion.button
                  layout
                  onClick={isRunning ? handleReset : () => setIsSettingsOpen(true)}
                  // "Settings" 버튼 배경색 (그라데이션)
                  className="rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] hover:from-[#95B8FF] hover:to-[#7CA8F0] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-none select-none"
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "초기화" : "시간 설정"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-3xl drop-shadow-lg text-white"
                      // "Settings" 버튼 텍스트 색상
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {isRunning ? "초기화" : "시간 설정"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="settings-controls"
                initial={{ opacity: 0, x: 50, y: -16 }}
                animate={{ opacity: 1, x: 0, y: -16 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center justify-center"
                style={{ marginTop: "-1rem" }}
              >
                {/* 시간 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("hours")}
                  onDoubleClick={() => setHours(0)}
                  // 시간 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "hours" ? "shadow-[0_0_15px_5px_rgba(192,132,252,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 시간 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">시간</div>
                  <div className="text-white text-3xl font-bold">{selectedUnit === "hours" && inputValue ? inputValue : hours}</div>
                </div>

                <div style={{ width: "1rem" }} />

                {/* 분 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("minutes")}
                  onDoubleClick={() => setMinutes(0)}
                  // 분 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "minutes" ? "shadow-[0_0_15px_5px_rgba(192,132,252,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 분 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">분</div>
                  <div className="text-white text-3xl font-bold">{selectedUnit === "minutes" && inputValue ? inputValue : minutes}</div>
                </div>

                <div style={{ width: "1rem" }} />

                {/* 초 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("seconds")}
                  onDoubleClick={() => setSeconds(0)}
                  // 초 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "seconds" ? "shadow-[0_0_15px_5px_rgba(192,132,252,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 초 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">초</div>
                  <div className="text-white text-3xl font-bold">{selectedUnit === "seconds" && inputValue ? inputValue : seconds}</div>
                </div>
                <div style={{ width: "1rem" }} />

                <div
                  className="relative rounded-2xl shadow-lg flex flex-col items-center justify-center"
                  style={{
                    width: "50px",
                    height: "65px",
                    borderRadius: "1.5rem",
                    // 화살표 버튼 배경색 (그라데이션)
                    background: "linear-gradient(180deg,#C5A8FF,#90B5F9)",
                    boxShadow: "0 10px 24px rgba(120,90,240,0.12)",
                    transform: "translateX(-6px)",
                  }}
                >
                  {/* 위쪽 화살표 버튼 */}
                  <button
                    onClick={handleIncrement}
                    className="w-full h-1/2 flex items-center justify-center rounded-t-2xl hover:brightness-105 transition border-none select-none"
                    aria-label="Increase value"
                    style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                  >
                    {/* 화살표 아이콘 색상 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333333" viewBox="0 0 16 16">
                      <path d="M8 5.5l4 4-1 1L8 7.5 5 10.5l-1-1 4-4z" />
                    </svg>
                  </button>

                  <div className="w-full h-px bg-white/20" />

                  {/* 아래쪽 화살표 버튼 */}
                  <button
                    onClick={handleDecrement}
                    className="w-full h-1/2 flex items-center justify-center rounded-b-2xl hover:brightness-95 transition border-none select-none"
                    aria-label="Decrease value"
                    style={{ borderBottomLeftRadius: "1.5rem", borderBottomRightRadius: "1.5rem" }}
                  >
                    {/* 화살표 아이콘 색상 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333333" viewBox="0 0 16 16">
                      <path d="M8 10.5L4 6.5l1-1L8 8.5l3-3 1 1-4 4z" />
                    </svg>
                  </button>
                </div>

                {/* "Done" 버튼 */}
                <div style={{ width: "1rem" }} />

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  // "Done" 버튼 배경색 (그라데이션)
                  className="rounded-md bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-none select-none"
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* "Done" 버튼 텍스트 색상 */}
                  <motion.span className="text-3xl drop-shadow-lg text-white" style={{ color: "white", fontSize: "1.5rem" }}>
                    완료
                  </motion.span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
