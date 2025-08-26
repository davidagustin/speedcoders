"use client";

import React from 'react';

export default function QuizCreatorWrapper() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">✨ Quick Quiz Creator</h3>
      <p className="text-gray-600 mb-4">
        Create custom quizzes from your favorite problems or let AI generate them for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
          <div className="text-2xl mb-2">🎯</div>
          <div className="font-medium">Smart Quiz</div>
          <div className="text-sm text-gray-600">AI-generated based on your skill level</div>
        </button>
        <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
          <div className="text-2xl mb-2">🏢</div>
          <div className="font-medium">Company Focus</div>
          <div className="text-sm text-gray-600">Problems from specific companies</div>
        </button>
        <button className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
          <div className="text-2xl mb-2">📚</div>
          <div className="font-medium">Topic Deep Dive</div>
          <div className="text-sm text-gray-600">Focus on specific algorithms/data structures</div>
        </button>
      </div>
    </div>
  );
}