import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1500000); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  // Wave animation
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
    setTimeLeft((minutes * 60 + seconds) * 1000);
  };

  const handleSetTime = () => {
    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    setTimeLeft(totalMilliseconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  useEffect(() => {
    handleSetTime();
  }, [minutes, seconds]);

  const displayMinutes = Math.floor(timeLeft / 60000);
  const displaySeconds = Math.floor((timeLeft % 60000) / 1000);

  const totalTime = (minutes * 60 + seconds) * 1000;
  const progress =
    totalTime > 0
      ? ((totalTime - timeLeft) / totalTime) * 100
      : 0;

  return (
    <div className="w-full max-w-md">
      {/* Timer Display Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-10">
        {/* Progress Circle */}
        <div className="relative mx-auto mb-6" style={{ width: '620px', height: '620px' }}>
          <svg
            className="w-full h-full"
            viewBox="0 0 256 256"
          >
            <defs>
              {/* Pastel purple gradient from bottom to top */}
              <linearGradient
                id="fillGradient"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFA8C5" />
                <stop offset="50%" stopColor="#C5A8FF" />
                <stop offset="100%" stopColor="#E5D4FF" />
              </linearGradient>
              {/* Sky blue background */}
              <linearGradient
                id="gradientBg"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E3F2FD" />
                <stop offset="50%" stopColor="#BBDEFB" />
                <stop offset="100%" stopColor="#90CAF9" />
              </linearGradient>
              <filter id="softGlow">
                <feGaussianBlur
                  stdDeviation="2"
                  result="coloredBlur"
                />
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
                      const baseY =
                        256 - (256 * progress) / 100;
                      const wave1 =
                        Math.sin(
                          (i / 30) * Math.PI * 4 +
                            (waveOffset * Math.PI) / 180,
                        ) * 4;
                      const wave2 =
                        Math.cos(
                          (i / 30) * Math.PI * 6 +
                            ((waveOffset * Math.PI) / 180) *
                              0.7,
                        ) * 2;
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

            {/* Background circle - Sky blue */}
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="url(#gradientBg)"
            />

            {/* Water fill effect - Pastel purple gradient filling from bottom */}
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="url(#fillGradient)"
              clipPath="url(#waterFill)"
              className="transition-all duration-1000 ease-in-out"
            />

            {/* Subtle outer border */}
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* Time Display directly in SVG */}
            <text
              x="128"
              y="128"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="60"
              fill="white"
              fontFamily="monospace"
              filter="url(#softGlow)"
            >
              {String(displayMinutes).padStart(2, "0")}:
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
                Complete! 🎉
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
                className="flex items-center justify-center gap-4"
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <motion.button
                  layout
                  onClick={isRunning ? handlePause : handleStart}
                  className="rounded-md bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '140px', height: '70px' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "pause" : "start"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-xl drop-shadow-lg"
                    >
                      {isRunning ? "Pause" : "Start"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  layout
                  onClick={isRunning ? handleReset : () => setIsSettingsOpen(true)}
                  className="rounded-md bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] hover:from-[#95B8FF] hover:to-[#7CA8F0] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '140px', height: '70px' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "reset" : "settings"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-xl drop-shadow-lg"
                    >
                      {isRunning ? "Reset" : "Settings"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="settings-controls"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center justify-center gap-4"
              >
                <div className="flex flex-col items-center">
                  <label className="text-sm">Minutes</label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                    className="w-20 text-center bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm">Seconds</label>
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value))}
                    className="w-20 text-center bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white"
                  />
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-md bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] hover:from-[#95B8FF] hover:to-[#7CA8F0] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '140px', height: '70px' }}
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
