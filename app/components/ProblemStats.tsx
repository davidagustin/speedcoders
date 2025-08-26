"use client";

import React from 'react';

export default function ProblemStats() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Problem Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-sm text-gray-600">Problems Solved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">78%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24</div>
          <div className="text-sm text-gray-600">Easy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">18</div>
          <div className="text-sm text-gray-600">Hard</div>
        </div>
      </div>
    </div>
  );
}