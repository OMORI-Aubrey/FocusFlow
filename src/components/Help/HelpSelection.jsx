import React from 'react';

const HelpSelection = ({ onSelect, closeModal }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeModal}
    >
      <div
        className="bg-white text-black p-8 rounded-lg shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">어떤 도움이 필요하세요?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSelect('guide')}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            사용법 가이드
          </button>
          <button
            onClick={() => onSelect('hotkey')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            조작키 설명
          </button>
        </div>
        <button
          className="absolute top-2 right-4 bg-transparent border-none text-3xl cursor-pointer text-gray-500"
          onClick={closeModal}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default HelpSelection;
