import React, { useState, useEffect } from 'react';
import './App.css';
import Timer from './components/Timer/Timer';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import TodoList from './components/Todo/TodoList';
import HelpButton from './components/Help/HelpButton';
import { loadState, saveState } from './utils/storageUtils';

const APP_STATE_KEY = 'focusFlowState';

// Helper to get date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

function App() {
  const initialState = loadState(APP_STATE_KEY) || {
    isFocusMode: true,
    focusTime: { h: 0, m: 25, s: 0 },
    restTime: { h: 0, m: 5, s: 0 },
    dailyStats: {},
  };

  const [isFocusMode, setIsFocusMode] = useState(initialState.isFocusMode);
  const [focusTime, setFocusTime] = useState(initialState.focusTime);
  const [restTime, setRestTime] = useState(initialState.restTime);
  const [dailyStats, setDailyStats] = useState(initialState.dailyStats || {});

  useEffect(() => {
    saveState(APP_STATE_KEY, {
      isFocusMode,
      focusTime,
      restTime,
      dailyStats,
    });
  }, [isFocusMode, focusTime, restTime, dailyStats]);

  const addFocusTime = (seconds) => {
    const todayStr = getTodayDateString();
    setDailyStats(prevStats => ({
      ...prevStats,
      [todayStr]: (prevStats[todayStr] || 0) + seconds,
    }));
  };

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
        addFocusTime={addFocusTime}
      />
      <TodoList dailyStats={dailyStats} />
      <HelpButton />
    </div >
  );
}

export default App;