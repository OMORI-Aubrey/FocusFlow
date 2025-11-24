import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarButton = ({ setIsCalendarOpen }) => {
  return (
    <button onClick={() => setIsCalendarOpen(true)} className="p-1 rounded-full hover:bg-gray-200">
      <CalendarIcon size={20} />
    </button>
  );
};

export default CalendarButton;