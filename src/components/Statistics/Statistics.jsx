import React from 'react';

const Statistics = ({ totalFocusTime }) => {
  const totalSeconds = Math.floor(totalFocusTime);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${month}/${day}`;

  return (
    <div className="text-center">
      <h2 className="text-lg font-bold text-gray-800">{formattedDate} 총 집중시간</h2>
      <p className="text-2xl font-semibold text-blue-500">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
};

export default Statistics;
