import React from 'react';
import { motion } from 'framer-motion';

function ModeSwitch({ isFocusMode, setIsFocusMode }) {
  return (
    <motion.div
      onClick={() => setIsFocusMode(!isFocusMode)}
      className="relative flex items-center w-32 h-12 rounded-full p-1 cursor-pointer"
      initial={false}
      animate={{
        background: isFocusMode
          ? 'linear-gradient(to right, #DCF0F7, #A2BFF9)'
          : 'linear-gradient(to right, #E2B4E2, #F3E0EE)', 
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
  );
}

export default ModeSwitch;