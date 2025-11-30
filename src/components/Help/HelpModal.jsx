import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const guideSlides = [
  {
    image: 'src/assets/images/mainTimer.png',
    text: '중앙의 타이머를 사용하여 집중 시간을 측정하세요. 시작 버튼을 눌러 타이머를 작동시킬 수 있습니다.',
  },
  {
    image: 'src/assets/images/switch.gif',
    text: '화면 왼쪽 위에 있는 스위치를 눌러 모드를 전환하세요. F는 집중모드, R은 휴식모드 입니다.',
  },
  {
    image: 'src/assets/images/toDoListAdd.gif',
    text: '오른쪽의 투두리스트에 오늘 할 일을 추가하고 관리할 수 있습니다. 완료한 항목은 체크하세요.',
  },
  {
    image: 'src/assets/images/soundPlay.gif',
    text: '화면 오른쪽 하단에 재생 버튼을 눌러 자연 소리를 재생하세요. 원하는 소리를 직접 선택할 수 있습니다.',
  },
  {
    image: 'src/assets/images/calenderBtn.png',
    text: '투두리스트 왼쪽 상단의 캘린더 아이콘을 클릭하여 날짜별 통계를 확인할 수 있습니다.',
  },
];

const hotkeySlides = [
  {
    image: 'src/assets/images/timerStartPauseSpacebar.gif',
    text: 'Spacebar: 타이머 시작/멈춤',
  },
  {
    image: 'src/assets/images/timerStopEsc.gif',
    text: 'Esc: [타이머 작동 중] 타이머 초기화 ',
  },
  {
    image: 'src/assets/images/timerSelectBtnsClick.gif',
    text: '[시간 설정] 마우스로 버튼 선택 후 화살표를 눌러 시간 조정',
  },
  {
    image: 'src/assets/images/timerSelectHMSArrow.gif',
    text: '[시간 설정] 왼쪽, 오른쪽 방향키: 시간, 분, 초 선택',
  },
  {
    image: 'src/assets/images/timerTimeUpDownArrow.gif',
    text: '[시간 설정] 위, 아래 방향키: 시간 올리기, 내리기',
  },
  {
    image: 'src/assets/images/timerSetTimeKeyboard.gif',
    text: '[시간 설정] 키보드로 숫자를 입력하여 원하는 시간 설정',
  },
  {
    image: 'src/assets/images/timerSetTimeZeroEsc.gif',
    text: '[시간 설정] Esc: 선택된 시간 0으로 만들기',
  },
  {
    image: 'src/assets/images/timerTimeSetDoneEnter.gif',
    text: '[시간 설정] Enter: 시간 선택 완료',
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
};

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const HelpModal = ({ contentType, closeModal }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const { title, slides } = content[contentType];

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prevPage) => {
      const nextPage = prevPage + newDirection;
      if (nextPage < 0) return slides.length - 1;
      if (nextPage >= slides.length) return 0;
      return nextPage;
    });
  };

  const slideIndex = page;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={closeModal}
    >
      <div
        className="bg-white text-black p-5 rounded-lg max-w-md w-11/12 relative shadow-xl text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 bg-transparent border-none text-3xl cursor-pointer text-red-500 z-10"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex items-center justify-between grow">
          <div className="bg-transparent border-none text-4xl cursor-pointer p-2 text-gray-700 select-none z-10" onClick={() => paginate(-1)}>
            &#10094;
          </div>

          <div className="relative grow h-80 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full flex flex-col items-center justify-center"
              >
                <img src={slides[slideIndex].image} alt={`Slide ${slideIndex + 1}`} className="h-60 w-full object-cover mb-4" />
                <p className="text-base text-gray-700 min-h-12 px-4">{slides[slideIndex].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-transparent border-none text-4xl cursor-pointer p-2 text-gray-700 select-none z-10" onClick={() => paginate(1)}>
            &#10095;
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
