import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Timer from './components/Timer/Timer';

function App() {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isFocusMode) {
      setHours(0);
      setMinutes(25);
      setSeconds(0);
    } else {
      setHours(0);
      setMinutes(5);
      setSeconds(0);
    }
  }, [isFocusMode]);

  return (
    <div className="App">
      <div className="absolute top-4 left-4">
        <div
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`relative flex items-center w-40 h-12 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            isFocusMode ? 'bg-purple-400' : 'bg-blue-300'
          }`}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            className="absolute w-10 h-10 bg-white rounded-full shadow-md"
            style={{
              left: isFocusMode ? '0.25rem' : 'auto',
              right: isFocusMode ? 'auto' : '0.25rem',
            }}
          />
          <div className="flex justify-around w-full">
            <span className={`font-bold z-10 ${isFocusMode ? 'text-white' : 'text-gray-600'}`}>
              Focus
            </span>
            <span className={`font-bold z-10 ${!isFocusMode ? 'text-white' : 'text-gray-600'}`}>
              Rest
            </span>
          </div>
        </div>
      </div>
      <Timer
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        setHours={setHours}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />
    </div>
  );
}

export default App;