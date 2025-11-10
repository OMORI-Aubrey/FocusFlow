import React from 'react';

const TodoList = () => {
  return (
    <div className="absolute right-0 top-0 h-full w-100 bg-gray-50 flex flex-col border-l border-gray-200">
      {/* Top Section - Empty for future features */}
      <div className="flex-none h-20 p-4">
        사운드
        {/* Placeholder for future top features */}
      </div>

      {/* Middle Section - Current TodoList content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">오늘의 할 일</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="새로운 할 일 추가..."
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            추가
          </button>
        </div>
        <ul className="space-y-2">
          {/* Placeholder for todo items */}
          <li className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
            <span className="text-gray-700">리액트 공부하기</span>
            <button className="text-red-500 hover:text-red-700">삭제</button>
          </li>
          <li className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
            <span className="text-gray-700 line-through">알고리즘 문제 풀기</span>
            <button className="text-red-500 hover:text-red-700">삭제</button>
          </li>
        </ul>
      </div>

      {/* Bottom Section - Empty for future features */}
      <div className="flex-none h-40 p-4">
        통계
        {/* Placeholder for future bottom features */}
      </div>
    </div>
  );
};

export default TodoList;
