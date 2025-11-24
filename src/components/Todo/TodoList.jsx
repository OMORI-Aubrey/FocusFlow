import React, { useState, useEffect } from 'react';
import Noizes from '../Sounds/Sounds';
import Statistics from '../Statistics/Statistics';
import CalendarModal from '../Calendar/CalendarModal'; // Import CalendarModal
import { Calendar as CalendarIcon } from 'lucide-react'; // Import CalendarIcon
import { loadState, saveState } from '../../utils/storageUtils';

const TODOS_STATE_KEY = 'todosState';

// Helper to get date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

const TodoList = ({ dailyStats }) => { // Changed prop from totalFocusTime to dailyStats
  // State Management
  const [todos, setTodos] = useState(loadState(TODOS_STATE_KEY) || []);
  const [inputText, setInputText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Add isCalendarOpen state

  useEffect(() => {
    saveState(TODOS_STATE_KEY, todos);
  }, [todos]);

  const todayStr = getTodayDateString();
  const todayFocusTime = dailyStats[todayStr] || 0; // Calculate todayFocusTime

  // Handler Functions
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputText.trim() === '') return;
    const newTodo = { id: Date.now(), text: inputText, done: false };
    setTodos([...todos, newTodo]);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingTodoId(null);
    setEditingText('');
  };

  const handleEditingKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText('');
  };

  // Filter todos into incomplete and complete lists
  const incompleteTodos = todos.filter(todo => !todo.done);
  const completeTodos = todos.filter(todo => todo.done);

  return (
    <div className="absolute right-0 top-0 h-full w-100 bg-[#F5F5F5] flex flex-col border-l border-gray-200">
      {/* Calendar Button - positioned at top-left of TodoList */}
      <button onClick={() => setIsCalendarOpen(true)} className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-200 z-10">
        <CalendarIcon size={20} />
      </button>

      {/* Top Section */}
      <div className="flex-none h-20 p-4">
        <Statistics totalFocusTime={todayFocusTime} /> {/* Pass todayFocusTime */}
      </div>

      <CalendarModal // Render CalendarModal
        isOpen={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}
        dailyStats={dailyStats}
      />

      {/* Middle Section - TodoList */}
      <div className="flex-grow p-3 pb-1 flex flex-col min-h-0">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex-none">오늘의 할 일</h2>
        <div className="flex mb-4 flex-none">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="새로운 할 일 추가..."
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            추가
          </button>
        </div>

        {/* Scrollable Lists Container */}
        <div className="flex-grow flex flex-col min-h-0">
          {/* Incomplete Todos Scrollable Area */}
          <div className="flex flex-col min-h-0" style={{ flexBasis: '60%' }}>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 flex-none">할 일</h3>
            <ul className="space-y-2 overflow-y-auto flex-grow">
              {incompleteTodos.map(todo => (
                <li key={todo.id} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
                  <div className="flex items-center flex-grow min-w-0">
                    <input type="checkbox" checked={todo.done} onChange={() => handleToggleTodo(todo.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                    {editingTodoId === todo.id ? (
                      <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} onKeyPress={(e) => handleEditingKeyPress(e, todo.id)} className="flex-grow p-1 border border-gray-300 rounded-md text-gray-800" autoFocus />
                    ) : (
                      <span className="text-black overflow-hidden break-words">{todo.text}</span>
                    )}
                  </div>
                  <div className="flex items-center ml-4 flex-none">
                    {editingTodoId === todo.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(todo.id)} className="text-blue-500 hover:text-blue-700 text-sm font-semibold mr-2">저장</button>
                        <button onClick={() => handleCancelEdit()} className="text-red-500 hover:text-red-700 text-sm font-semibold">취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleStartEdit(todo)} className="text-gray-500 hover:text-green-700 text-sm font-semibold mr-2 text-green-500">수정</button>
                        <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">삭제</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Completed Todos Scrollable Area */}
          <div className="flex flex-col min-h-0 pt-4" style={{ flexBasis: '40%' }}>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 flex-none">완료</h3>
            <ul className="space-y-2 overflow-y-auto flex-grow">
              {completeTodos.map(todo => (
                <li key={todo.id} className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm opacity-60">
                  <div className="flex items-center flex-grow min-w-0">
                    <input type="checkbox" checked={todo.done} onChange={() => handleToggleTodo(todo.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                    <span className="text-gray-500 overflow-hidden break-words">{todo.text}</span>
                  </div>
                  <div className="flex items-center ml-4 flex-none">
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">삭제</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-none h-40 p-4">
        <Noizes />
      </div>
    </div>
  );
};

export default TodoList;
