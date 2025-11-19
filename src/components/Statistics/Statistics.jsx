import React from 'react';

const Statistics = ({ totalFocusTime }) => {
  const totalSeconds = Math.floor(totalFocusTime);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="text-center">
      <h2 className="text-lg font-bold text-gray-800">총 집중시간</h2>
      <p className="text-2xl font-semibold text-blue-500">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
};

export default Statistics;
