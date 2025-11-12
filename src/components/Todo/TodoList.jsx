import React, { useState } from 'react';

const TodoList = () => {
  // State Management
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');

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

  // Filter todos into incomplete and complete lists
  const incompleteTodos = todos.filter(todo => !todo.done);
  const completeTodos = todos.filter(todo => todo.done);

  return (
    <div className="absolute right-0 top-0 h-full w-100 bg-gray-50 flex flex-col border-l border-gray-200">
      {/* Top Section */}
      <div className="flex-none h-20 p-4">
        통계
      </div>

      {/* Middle Section - TodoList */}
      <div className="flex-grow p-3 pb-1 flex flex-col min-h-0">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex-none">오늘의 할 일</h2>
        <div className="flex mb-4 flex-none">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
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
            <h3 className="text-lg font-semibold mb-2 text-gray-700 flex-none">작업</h3>
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
                      <button onClick={() => handleSaveEdit(todo.id)} className="text-blue-500 hover:text-blue-700 text-sm font-semibold mr-2">저장</button>
                    ) : (
                      <button onClick={() => handleStartEdit(todo)} className="text-gray-500 hover:text-gray-700 text-sm font-semibold mr-2 text-green-500">수정</button>
                    )}
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">삭제</button>
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
        소리
      </div>
    </div>
  );
};

export default TodoList;
