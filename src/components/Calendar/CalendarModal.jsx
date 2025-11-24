import React from 'react';
import Modal from 'react-modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarModal.css'; // Import custom styles

// Helper to format seconds into a readable string
const formatTime = (seconds) => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper to get date in YYYY-MM-DD format from a Date object
const getDateString = (date) => {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

const CalendarModal = ({ isOpen, onRequestClose, dailyStats }) => {

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = getDateString(date);
      const focusTime = dailyStats[dateStr];
      if (focusTime && focusTime > 0) {
        return (
          <div className="focus-time-display">
            {formatTime(focusTime)}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDay() === 0) {
        return 'sunday';
      }
      if (date.getDay() === 6) {
        return 'saturday';
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Focus Calendar"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '90vw',
          maxHeight: '90vh',
        },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">집중 시간 달력</h2>
        <button onClick={onRequestClose} className="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        calendarType="gregory"
        maxDetail="month"
        navigationLabel={({ date, view, label }) => (
          <span>{label}</span>
        )}
        value={null}
        showFixedNumberOfWeeks={true}
        formatDay={(_locale, date) => date.getDate()}
      />
    </Modal>
  );
};

export default CalendarModal;
