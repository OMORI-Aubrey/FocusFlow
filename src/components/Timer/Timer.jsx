import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [hours, setHours] = useState(0);
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
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setTimeLeft(totalMilliseconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  useEffect(() => {
    handleSetTime();
  }, [hours, minutes, seconds]);

  const displayHours = Math.floor(timeLeft / 3600000);
  const displayMinutes = Math.floor((timeLeft % 3600000) / 60000);
  const displaySeconds = Math.floor((timeLeft % 60000) / 1000);

  const totalTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
  const progress =
    totalTime > 0
      ? ((totalTime - timeLeft) / totalTime) * 100
      : 0;

  return (
    <div className="w-full max-w-md">
      {/* Timer Display Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-6">
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
                className="flex items-center justify-center"
                style={{ marginTop: '-1rem' }}
                initial={{ opacity: 0, x: -50, y: -16 }}
                animate={{ opacity: 1, x: 0, y: -16 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <motion.button
                  layout
                  onClick={isRunning ? handlePause : handleStart}
                  className="rounded-2xl bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '130px', height: '65px', borderRadius: '1.5rem' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "pause" : "start"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-3xl drop-shadow-lg text-white"
                      style={{ color: 'white', fontSize: '1.5rem' }}
                    >{isRunning ? "Pause" : "Start"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                <div style={{ width: '1rem' }} />

                <motion.button
                  layout
                  onClick={isRunning ? handleReset : () => setIsSettingsOpen(true)}
                  className="rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] hover:from-[#95B8FF] hover:to-[#7CA8F0] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '130px', height: '65px', borderRadius: '1.5rem' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isRunning ? "reset" : "settings"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-3xl drop-shadow-lg text-white"
                      style={{ color: 'white', fontSize: '1.5rem' }}
                    >
                      {isRunning ? "Reset" : "Settings"}
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
                style={{ marginTop: '-1rem' }}
              >
                <div
                  className="rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] shadow-lg p-2 flex flex-col justify-between relative"
                  style={{ width: '150px', height: '90px', borderRadius: '1.5rem' }}
                >
                  <label className="text-white text-sm text-center w-full">Hours</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-1/2 mx-auto text-center bg-transparent border-b-2 border-white/50 focus:outline-none text-white text-2xl font-bold"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
                    <button
                      onClick={() => setHours(hours + 1)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setHours(hours > 0 ? hours - 1 : 0)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14l-4.796-5.481c-.566-.647-.106-1.659.753-1.659h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ width: '1rem' }} />

                <div
                  className="rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] shadow-lg p-2 flex flex-col justify-between relative"
                  style={{ width: '150px', height: '90px', borderRadius: '1.5rem' }}
                >
                  <label className="text-white text-sm text-center w-full">Minutes</label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value))}
                    className="w-1/2 mx-auto text-center bg-transparent border-b-2 border-white/50 focus:outline-none text-white text-2xl font-bold"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
                    <button
                      onClick={() => setMinutes(minutes + 1)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setMinutes(minutes > 0 ? minutes - 1 : 0)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14l-4.796-5.481c-.566-.647-.106-1.659.753-1.659h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ width: '1rem' }} />

                <div
                  className="rounded-2xl bg-gradient-to-br from-[#A8C5FF] to-[#90B5F9] shadow-lg p-2 flex flex-col justify-between relative"
                  style={{ width: '150px', height: '90px', borderRadius: '1.5rem' }}
                >
                  <label className="text-white text-sm text-center w-full">Seconds</label>
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value))}
                    className="w-1/2 mx-auto text-center bg-transparent border-b-2 border-white/50 focus:outline-none text-white text-2xl font-bold"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
                    <button
                      onClick={() => setSeconds(seconds + 1)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setSeconds(seconds > 0 ? seconds - 1 : 0)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.247 11.14l-4.796-5.481c-.566-.647-.106-1.659.753-1.659h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ width: '1rem' }} />

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-md bg-gradient-to-br from-[#C5A8FF] to-[#B095F9] hover:from-[#B895FF] hover:to-[#A382F0] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  style={{ width: '130px', height: '65px', borderRadius: '1.5rem' }}
                >
                  <motion.span
                    className="text-3xl drop-shadow-lg text-white"
                    style={{ color: 'white', fontSize: '1.5rem' }}
                  >
                    Done
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
