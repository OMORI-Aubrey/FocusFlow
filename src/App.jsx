import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import Timer from './components/Timer/Timer';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import TodoList from './components/Todo/TodoList';
import { loadState, saveState } from './utils/storageUtils';

const APP_STATE_KEY = 'focusFlowState';

function App() {
  const initialState = loadState(APP_STATE_KEY) || {
    isFocusMode: true,
    focusTime: { h: 0, m: 25, s: 0 },
    restTime: { h: 0, m: 5, s: 0 },
    totalFocusTime: 0,
    lastUpdated: new Date().toLocaleDateString(),
  };

  const [isFocusMode, setIsFocusMode] = useState(initialState.isFocusMode);
  const [focusTime, setFocusTime] = useState(initialState.focusTime);
  const [restTime, setRestTime] = useState(initialState.restTime);
  const [totalFocusTime, setTotalFocusTime] = useState(initialState.totalFocusTime); // in seconds
  const [lastUpdated, setLastUpdated] = useState(initialState.lastUpdated);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (lastUpdated !== today) {
      setTotalFocusTime(0);
      setLastUpdated(today);
    }
  }, []); // Runs only on mount

  useEffect(() => {
    saveState(APP_STATE_KEY, {
      isFocusMode,
      focusTime,
      restTime,
      totalFocusTime,
      lastUpdated,
    });
  }, [isFocusMode, focusTime, restTime, totalFocusTime, lastUpdated]);

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
        setTotalFocusTime={setTotalFocusTime}
      />
      <TodoList totalFocusTime={totalFocusTime} />
    </div >
  );
}

export default App;