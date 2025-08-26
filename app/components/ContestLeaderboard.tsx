"use client";

import React, { useState } from 'react';

interface ContestParticipant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  problemsSolved: number;
  totalProblems: number;
  timeSpent: number;
  accuracy: number;
  streak: number;
  rank: number;
  country: string;
  badges: string[];
  isOnline: boolean;
  lastSubmission: Date;
}

export default function ContestLeaderboard() {
  const [timeFilter, setTimeFilter] = useState('live');
  const [sortBy, setSortBy] = useState('rank');

  // Mock data
  const participants: ContestParticipant[] = [
    {
      id: '1',
      name: 'CodeMaster2024',
      avatar: '👨‍💻',
      score: 2850,
      problemsSolved: 12,
      totalProblems: 15,
      timeSpent: 145,
      accuracy: 95.2,
      streak: 8,
      rank: 1,
      country: 'US',
      badges: ['🥇', '⚡', '🎯'],
      isOnline: true,
      lastSubmission: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: '2',
      name: 'AlgoNinja',
      avatar: '🥷',
      score: 2720,
      problemsSolved: 11,
      totalProblems: 15,
      timeSpent: 158,
      accuracy: 91.8,
      streak: 6,
      rank: 2,
      country: 'IN',
      badges: ['🥈', '🚀', '💎'],
      isOnline: true,
      lastSubmission: new Date(Date.now() - 180000), // 3 minutes ago
    },
    {
      id: '3',
      name: 'ByteWarrior',
      avatar: '⚔️',
      score: 2650,
      problemsSolved: 10,
      totalProblems: 15,
      timeSpent: 142,
      accuracy: 88.4,
      streak: 5,
      rank: 3,
      country: 'CN',
      badges: ['🥉', '🔥', '⭐'],
      isOnline: false,
      lastSubmission: new Date(Date.now() - 600000), // 10 minutes ago
    },
    // Add more participants...
  ];

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸',
      'IN': '🇮🇳',
      'CN': '🇨🇳',
      'UK': '🇬🇧',
      'DE': '🇩🇪',
      'JP': '🇯🇵',
      'KR': '🇰🇷',
      'CA': '🇨🇦',
    };
    return flags[country] || '🌍';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTimeSinceLastSubmission = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Contest Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">🏆 Weekly Championship</h2>
            <p className="text-purple-100">March 2024 • Round 3</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">2:45:32</div>
            <div className="text-purple-100">Time Remaining</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-purple-100">Participants</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-purple-100">Problems</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">$5,000</div>
            <div className="text-sm text-purple-100">Prize Pool</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">4h</div>
            <div className="text-sm text-purple-100">Duration</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="text-xl font-bold">📊 Live Leaderboard</h3>
          <div className="flex gap-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="live">Live Rankings</option>
              <option value="final">Final Results</option>
              <option value="practice">Practice Mode</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="rank">Sort by Rank</option>
              <option value="score">Sort by Score</option>
              <option value="accuracy">Sort by Accuracy</option>
              <option value="time">Sort by Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Participant</div>
            <div className="col-span-2">Score</div>
            <div className="col-span-2">Problems</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Status</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {participants.map((participant, index) => (
            <div 
              key={participant.id} 
              className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                participant.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getRankDisplay(participant.rank)}</span>
                    {participant.rank <= 10 && participant.rank !== index + 1 && (
                      <span className="text-green-600 text-xs">↗️</span>
                    )}
                  </div>
                </div>

                {/* Participant */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-2xl">{participant.avatar}</div>
                      {participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {participant.name}
                        <span className="text-sm">{getCountryFlag(participant.country)}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {participant.badges.map((badge, i) => (
                          <span key={i} className="text-xs">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2">
                  <div className="font-bold text-lg text-blue-600">{participant.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{participant.accuracy}% accuracy</div>
                </div>

                {/* Problems */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">
                      {participant.problemsSolved}/{participant.totalProblems}
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(participant.problemsSolved / participant.totalProblems) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {participant.streak > 0 && `🔥 ${participant.streak} streak`}
                  </div>
                </div>

                {/* Time */}
                <div className="col-span-2">
                  <div className="font-medium">{formatTime(participant.timeSpent)}</div>
                  <div className="text-xs text-gray-500">total time</div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm font-medium">
                      {participant.isOnline ? 'Active' : 'Offline'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {getTimeSinceLastSubmission(participant.lastSubmission)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">📈 Problem Difficulty Breakdown</h3>
          <div className="space-y-3">
            {[
              { difficulty: 'Easy', count: 5, solved: 4.2, color: 'bg-green-500' },
              { difficulty: 'Medium', count: 7, solved: 2.8, color: 'bg-yellow-500' },
              { difficulty: 'Hard', count: 3, solved: 0.9, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.difficulty} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${item.color} rounded`} />
                  <span className="font-medium">{item.difficulty}</span>
                  <span className="text-gray-500">({item.count} problems)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Avg: {item.solved} solved
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">🎯 Top Performers</h3>
          <div className="space-y-3">
            {participants.slice(0, 5).map((participant, index) => (
              <div key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getRankDisplay(index + 1)}</span>
                  <div className="text-xl">{participant.avatar}</div>
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-xs text-gray-500">{participant.score} pts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {participant.problemsSolved}/{participant.totalProblems}
                  </div>
                  <div className="text-xs text-gray-500">{participant.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contest Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-bold mb-4">💡 Contest Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-80 rounded-lg p-4">
            <div className="font-semibold text-indigo-800">Hardest Problem</div>
            <div className="text-sm text-indigo-600">Problem #12 - "Graph Cycles"</div>
            <div className="text-xs text-gray-600 mt-1">Only 15% solved it</div>
          </div>
          <div className="bg-white bg-opacity-80 rounded-lg p-4">
            <div className="font-semibold text-green-800">Most Popular</div>
            <div className="text-sm text-green-600">Problem #3 - "Two Sum Variant"</div>
            <div className="text-xs text-gray-600 mt-1">95% attempted it</div>
          </div>
          <div className="bg-white bg-opacity-80 rounded-lg p-4">
            <div className="font-semibold text-purple-800">Speed King</div>
            <div className="text-sm text-purple-600">CodeMaster2024</div>
            <div className="text-xs text-gray-600 mt-1">Fastest solver (avg 8.2 min)</div>
          </div>
        </div>
      </div>
    </div>
  );
}