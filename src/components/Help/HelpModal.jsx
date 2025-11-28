import React, { useState } from 'react';

const guideSlides = [
  {
    image: '/images/timer.png',
    text: '중앙의 타이머를 사용하여 집중 시간을 측정하세요. 시작 버튼을 눌러 타이머를 작동시킬 수 있습니다.',
  },
  {
    image: '/images/todo.png',
    text: '오른쪽의 투두리스트에 오늘 할 일을 추가하고 관리할 수 있습니다. 완료한 항목은 체크하세요.',
  },
  {
    image: '/images/calendar.png',
    text: '왼쪽 상단의 캘린더 아이콘을 클릭하여 날짜별 통계를 확인하고, 과거의 집중도를 돌아볼 수 있습니다.',
  },
];

const hotkeySlides = [
  {
    image: '/images/keyboard.png',
    text: 'Spacebar: 타이머를 시작하거나 멈춥니다.',
  },
  {
    image: '/images/keyboard.png',
    text: 'Ctrl + R: 타이머를 초기화합니다.',
  },
  {
    image: '/images/keyboard.png',
    text: 'Esc: 열려있는 팝업 창을 닫습니다.',
  },
];

const content = {
  guide: {
    title: 'FocusFlow',
    slides: guideSlides,
  },
  hotkey: {
    title: '타이머 조작키',
    slides: hotkeySlides,
  }
}

const HelpModal = ({ contentType, closeModal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { title, slides } = content[contentType];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeModal}
    >
      <div
        className="bg-white text-black p-5 rounded-lg max-w-md w-11/12 relative shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 bg-transparent border-none text-3xl cursor-pointer text-red-500"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex items-center justify-between">
          <button className="bg-transparent border-none text-4xl cursor-pointer p-2 text-gray-700 select-none" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="flex flex-col items-center">
            <img src={slides[currentSlide].image} alt={`Slide ${currentSlide + 1}`} className="max-w-full h-auto max-h-72 mb-4" />
            <p className="text-base text-gray-700 min-h-12">{slides[currentSlide].text}</p>
          </div>
          <button className="bg-transparent border-none text-4xl cursor-pointer p-2 text-gray-700 select-none" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
