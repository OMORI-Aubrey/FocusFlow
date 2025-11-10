import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Timer from './components/Timer/Timer';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import TodoList from './components/Todo/TodoList';

function App() {
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [focusTime, setFocusTime] = useState({ h: 0, m: 25, s: 0 });
  const [restTime, setRestTime] = useState({ h: 0, m: 5, s: 0 });

  const { h, m, s } = isFocusMode ? focusTime : restTime;
  const setCurrentTime = isFocusMode ? setFocusTime : setRestTime;

  const setHours = (newHours) => setCurrentTime(prev => ({ ...prev, h: Number(newHours) }));
  const setMinutes = (newMinutes) => setCurrentTime(prev => ({ ...prev, m: Number(newMinutes) }));
  const setSeconds = (newSeconds) => setCurrentTime(prev => ({ ...prev, s: Number(newSeconds) }));

  return (
    <div className="App">
      <div className="absolute top-4 left-4">
        <ModeSwitch isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
      </div>
      <Timer
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
        hours={h}
        minutes={m}
        seconds={s}
        setHours={setHours}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
      />
      <TodoList />
    </div >
  );
}

export default App;