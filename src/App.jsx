import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Timer from './components/Timer/Timer';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';

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
        <ModeSwitch isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
      </div>
      <Timer
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
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