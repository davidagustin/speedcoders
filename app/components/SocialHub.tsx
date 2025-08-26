"use client";

import React from 'react';

export default function SocialHub() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">🌐 Social Hub</h2>
        <p className="text-gray-600 mb-6">
          Connect with other developers, share your achievements, and learn together.
        </p>
        
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">10,247</div>
            <div className="text-sm text-blue-700">Active Users</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">2,845</div>
            <div className="text-sm text-green-700">Solutions Shared</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">1,250</div>
            <div className="text-sm text-purple-700">Study Groups</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">15,420</div>
            <div className="text-sm text-orange-700">Discussions</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          {[
            { user: "CodeMaster", action: "solved", target: "Binary Tree Inorder Traversal", time: "2 mins ago" },
            { user: "AlgoExpert", action: "shared solution for", target: "Two Sum", time: "5 mins ago" },
            { user: "DevNinja", action: "started study group", target: "Dynamic Programming", time: "10 mins ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600"> {activity.action} </span>
                <span className="font-medium">{activity.target}</span>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}