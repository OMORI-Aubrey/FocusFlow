import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function Timer({ isFocusMode, setIsFocusMode, hours, minutes, seconds, setHours, setMinutes, setSeconds }) {

  // timeLeft는 밀리초 단위
  const [timeLeft, setTimeLeft] = useState(() => (hours * 3600 + minutes * 60 + seconds) * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("minutes");
  const [inputValue, setInputValue] = useState("");
  const [changeDirection, setChangeDirection] = useState("none");
  const inputTimeoutRef = useRef(null);
  const isSwitchingMode = useRef(false);
  const keyPressTimeRef = useRef(0);

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
            setIsComplete(false);
      
            if (isSettingsOpen) {
              setIsRunning(false); // Stop running only when settings are open
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [hours, minutes, seconds, isSettingsOpen]);

          useEffect(() => {
            // Auto-start timer when switching modes
            if (isSwitchingMode.current) {
              setIsRunning(true);
              isSwitchingMode.current = false;
            }
          }, [isFocusMode, setIsRunning]);
          
  const handleStart = useCallback(() => {
    // If timer is paused and has time left, resume
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  }, [timeLeft, setIsRunning, setIsComplete]);

  const handleModeSwitch = useCallback(() => {
    isSwitchingMode.current = true;
    setIsComplete(false);
    setIsFocusMode(prev => !prev);
  }, [setIsFocusMode, setIsComplete]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, [setIsRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    const total = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTimeLeft(total);
  }, [hours, minutes, seconds, setIsRunning, setIsComplete, setTimeLeft]);

  // display values from timeLeft
  const displayHours = Math.floor(timeLeft / 3600000);
  const displayMinutes = Math.floor((timeLeft % 3600000) / 60000);
  const displaySeconds = Math.floor((timeLeft % 60000) / 1000);

  const totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;

  let progress;

  if (isSwitchingMode.current || isSettingsOpen) {
    // While switching or in settings, lock progress to the mode's starting position.
    progress = isFocusMode ? 0 : 100;
  } else {
    progress = isFocusMode
      ? (isComplete ? 100 : (isRunning && totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0))
      : (isComplete ? 0 : (totalTime > 0 ? (timeLeft / totalTime) * 100 : 100));
  }

  // Input change handlers that guard against NaN and apply clamps
  const onHoursChange = (value) => {
    const n = parseInt(value);
    if (isNaN(n)) {
      setHours(0);
    } else if (n >= 24) {
      setHours(24);
      setMinutes(0);
      setSeconds(0);
    } else {
      setHours(n);
    }
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
    setChangeDirection("increment");
    if (selectedUnit === "hours") {
      incHours();
    } else if (selectedUnit === "minutes") {
      incMinutes();
    } else {
      incSeconds();
    }
  };

  const handleDecrement = () => {
    setChangeDirection("decrement");
    if (selectedUnit === "hours") {
      decHours();
    } else if (selectedUnit === "minutes") {
      decMinutes();
    } else {
      decSeconds();
    }
  };

  // Arrow click handlers (increment/decrement)
  const incHours = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds >= 24 * 3600) {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
    }
    totalSeconds += 3600;

    if (totalSeconds > 24 * 3600) {
        totalSeconds = 24 * 3600;
    }
    
    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };
  const incMinutes = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds >= 24 * 3600) return;
    totalSeconds += 60;

    if (totalSeconds > 24 * 3600) {
        totalSeconds = 24 * 3600;
    }

    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };
  const incSeconds = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds >= 24 * 3600) return;
    totalSeconds += 1;
    
    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };
  const decHours = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    totalSeconds -= 3600;
    if (totalSeconds < 0) {
        totalSeconds = 24 * 3600 + totalSeconds; // wrap around
    }

    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };
  const decMinutes = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    totalSeconds -= 60;
    if (totalSeconds < 0) {
        totalSeconds = 24 * 3600 + totalSeconds; // wrap around
    }

    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };
  const decSeconds = () => {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    totalSeconds -= 1;
    if (totalSeconds < 0) {
        totalSeconds = 24 * 3600 - 1; // wrap to 23:59:59
    }

    const newHours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const newMinutes = Math.floor(remainingSeconds / 60);
    const newSeconds = remainingSeconds % 60;

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSettingsOpen) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key >= "0" && e.key <= "9") {
        if (inputValue.length < 4) {
          setInputValue((prev) => prev + e.key);
        }
      } else if (e.key === "Backspace") {
        setInputValue((prev) => prev.slice(0, -1));
      } else if (e.key === "ArrowUp") {
        const now = Date.now();
        if (now - keyPressTimeRef.current > 100) { // 100ms delay
          handleIncrement();
          keyPressTimeRef.current = now;
        }
      } else if (e.key === "ArrowDown") {
        const now = Date.now();
        if (now - keyPressTimeRef.current > 100) { // 100ms delay
          handleDecrement();
          keyPressTimeRef.current = now;
        }
      } else if (e.key === "ArrowRight") {
        if (selectedUnit === "hours") {
          setSelectedUnit("minutes");
        } else if (selectedUnit === "minutes") {
          setSelectedUnit("seconds");
        } else { // seconds
          setSelectedUnit("hours");
        }
      } else if (e.key === "ArrowLeft") {
        if (selectedUnit === "hours") {
          setSelectedUnit("seconds");
        } else if (selectedUnit === "minutes") {
          setSelectedUnit("hours");
        } else { // seconds
          setSelectedUnit("minutes");
        }
      } else if (e.key === "Enter") {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsOpen, inputValue, selectedUnit, hours, minutes, seconds, setIsSettingsOpen]);

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
          if (newTime >= 24) {
            setHours(24);
            setMinutes(0);
            setSeconds(0);
          } else {
            setHours(newTime);
          }
        } else if (selectedUnit === "minutes") {
          const newMinutes = newTime % 60;
          const overflowHours = Math.floor(newTime / 60);
          const finalHours = hours + overflowHours;
          if (finalHours >= 24) {
            setHours(24);
            setMinutes(0);
            setSeconds(0);
          } else {
            setHours(finalHours);
            setMinutes(newMinutes);
          }
        } else if (selectedUnit === "seconds") {
          const newSeconds = newTime % 60;
          const overflowMinutes = Math.floor(newTime / 60);
          
          const totalMinutes = minutes + overflowMinutes;
          const finalMinutes = totalMinutes % 60;
          const overflowHours = Math.floor(totalMinutes / 60);
          const finalHours = hours + overflowHours;

          if (finalHours >= 24) {
            setHours(24);
            setMinutes(0);
            setSeconds(0);
          } else {
            setHours(finalHours);
            setMinutes(finalMinutes);
            setSeconds(newSeconds);
          }
        }

        setInputValue("");
      }, 1000);
    }

    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [inputValue, selectedUnit, hours, minutes, setHours, setMinutes, setSeconds]);

  useEffect(() => {
    if (changeDirection !== "none") {
      const timer = setTimeout(() => setChangeDirection("none"), 500);
      return () => clearTimeout(timer);
    }
  }, [hours, minutes, seconds, changeDirection]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't interfere with settings input
      if (isSettingsOpen) return;

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'Escape') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isRunning, isSettingsOpen, handlePause, handleStart, handleReset]);

  return (
    <div className="flex flex-col items-center" style={{ marginLeft: "-450px" }}>

        {/* Progress Circle */}
        <div className="relative mx-auto mb-6" style={{ width: "550px", height: "550px" }}>
          <svg className="w-full h-full" viewBox="0 0 256 256">
            <defs>
              {/* 타이머 진행률을 채우는 그라데이션 색상 */}
              <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F0C5EE" />
              <stop offset="50%" stopColor="#F0C5EE" />
              <stop offset="100%" stopColor="#F3E0EE" />
              </linearGradient>
              {/* 타이머 배경 그라데이션 색상 */}
              <linearGradient id="gradientBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DCF0F7" />
              <stop offset="50%" stopColor="#c5ddfe" />
              <stop offset="100%" stopColor="#CADFFA" />
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
                    ${Array.from({ length: 20 }, (_, i) => {
                    const x = (256 / 20) * (i + 1);
                    const baseY = 256 - (256 * progress) / 100;
                    const wave1 = Math.sin((i / 20) * Math.PI * 4 + (waveOffset * Math.PI) / 180) * 4;
                    const wave2 = Math.cos((i / 20) * Math.PI * 6 + ((waveOffset * Math.PI) / 180) * 0.7) * 2;
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
                initial={{ opacity: 0, x: -50, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <motion.button
                  layout
                  onClick={isComplete ? handleModeSwitch : (isRunning ? handlePause : handleStart)}
                  // "Start" 버튼 배경색 (그라데이션)
                  className="rounded-2xl bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-none select-none"
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isComplete ? "다음" : (isRunning ? "일시중지" : "시작")}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-3xl drop-shadow-lg text-white"
                      // "Start" 버튼 텍스트 색상
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {isComplete ? "다음" : (isRunning ? "일시중지" : "시작")}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <div style={{ width: "1rem" }} />

                <motion.button
                  layout
                  onClick={isRunning ? handleReset : () => {
                    if (isComplete) {
                      setIsComplete(false);
                      setIsFocusMode(prev => !prev);
                    }
                    setIsSettingsOpen(true);
                  }}
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
                initial={{ opacity: 0, x: 50, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center justify-center"
                style={{ marginTop: "0rem" }}
              >
                {/* 시간 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("hours")}
                  onDoubleClick={() => setHours(0)}
                  // 시간 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "hours" ? "shadow-[0_0_15px_5px_rgba(161,195,241,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 시간 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">시간</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hours}
                      initial={{ y: changeDirection === "increment" ? 10 : -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: changeDirection === "increment" ? -10 : 10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-3xl font-bold"
                    >
                      {selectedUnit === "hours" && inputValue ? inputValue : hours}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div style={{ width: "1rem" }} />

                {/* 분 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("minutes")}
                  onDoubleClick={() => setMinutes(0)}
                  // 분 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "minutes" ? "shadow-[0_0_15px_5px_rgba(161,195,241,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 분 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">분</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={minutes}
                      initial={{ y: changeDirection === "increment" ? 10 : -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: changeDirection === "increment" ? -10 : 10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-3xl font-bold"
                    >
                      {selectedUnit === "minutes" && inputValue ? inputValue : minutes}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div style={{ width: "1rem" }} />

                {/* 초 설정 카드 */}
                <div
                  onClick={() => setSelectedUnit("seconds")}
                  onDoubleClick={() => setSeconds(0)}
                  // 초 설정 카드 배경색 (그라데이션)
                  className={`relative rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none ${selectedUnit === "seconds" ? "shadow-[0_0_15px_5px_rgba(161,195,241,0.7)]" : "shadow-lg"}`}
                  style={{ width: "130px", height: "65px", borderRadius: "1.5rem" }}
                >
                  {/* 초 설정 카드 텍스트 색상 */}
                  <div className="text-white text-base font-medium">초</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={seconds}
                      initial={{ y: changeDirection === "increment" ? 10 : -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: changeDirection === "increment" ? -10 : 10, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-3xl font-bold"
                    >
                      {selectedUnit === "seconds" && inputValue ? inputValue : seconds}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div style={{ width: "1rem" }} />

                <div
                  className="relative rounded-2xl shadow-lg flex flex-col items-center justify-center ml-1"
                  style={{
                    width: "50px",
                    height: "65px",
                    borderRadius: "1.5rem",
                    // 화살표 버튼 배경색 (그라데이션)
                    background: "linear-gradient(180deg,#C5A8FF,#C5A8FF)",
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
  );
}
