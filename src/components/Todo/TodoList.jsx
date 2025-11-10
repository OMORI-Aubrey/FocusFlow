import React, { useState } from 'react';

const TodoList = () => {
  // State Management
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  // Handler Functions
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputText.trim() === '') return; // Prevent adding empty todos
    const newTodo = {
      id: Date.now(),
      text: inputText,
      done: false,
    };
    setTodos([...todos, newTodo]);
    setInputText(''); // Clear input after adding
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

  return (
    <div className="absolute right-0 top-0 h-full w-100 bg-gray-50 flex flex-col border-l border-gray-200">
      {/* Top Section */}
      <div className="flex-none h-20 p-4">
        통계
        {/* Placeholder for future top features */}
      </div>

      {/* Middle Section - TodoList */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">오늘의 할 일</h2>
        <div className="flex mb-4 text-black">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="새로운 할 일 추가..."
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            추가
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleTodo(todo.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <span className={`text-gray-700 ${todo.done ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="flex-none h-50 p-4">
        소리재생
        {/* Placeholder for future bottom features */}
      </div>
    </div>
  );
};

export default TodoList;
