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
        <motion.div
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="relative flex items-center w-32 h-12 rounded-full p-1 cursor-pointer"
          initial={false}
          animate={{
            background: isFocusMode
              ? 'linear-gradient(to right, #E5D4FF, #C5A8FF)' // purple-500 to pink-500
              : 'linear-gradient(to right, #90CAF9, #BBDEFB)', // blue-400 to cyan-400
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            layout
            transition={{ type: 'tween', duration: 0.5 }}
            className="absolute w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-lg font-bold text-gray-400"
            style={{
              left: isFocusMode ? '0.25rem' : 'auto',
              right: isFocusMode ? 'auto' : '0.25rem',
            }}
          >
            {isFocusMode ? 'F' : 'R'}
          </motion.div>
        </motion.div>
      </div>
      <Timer
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        setHours={setHours}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />
    </div >
  );
}

export default App;