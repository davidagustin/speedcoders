"use client";

import { QuizStats } from '../lib/storage';

interface StatsDisplayProps {
  stats: QuizStats;
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const achievements = [
    { id: 'First Steps', name: 'First Steps', description: 'Complete your first quiz', icon: '🎯' },
    { id: 'Getting Started', name: 'Getting Started', description: 'Answer 10 questions', icon: '🚀' },
    { id: 'Quiz Master', name: 'Quiz Master', description: 'Answer 50 questions', icon: '🏆' },
    { id: 'Centurion', name: 'Centurion', description: 'Answer 100 questions', icon: '💯' },
    { id: 'Excellence', name: 'Excellence', description: '90%+ average score (10+ questions)', icon: '⭐' },
    { id: 'Perfection', name: 'Perfection', description: '95%+ average score (25+ questions)', icon: '👑' },
    { id: 'Explorer', name: 'Explorer', description: 'Attempt 15 different problems', icon: '🗺️' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Your Statistics</h3>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
          <div className="text-sm text-gray-600">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(stats.averageScore)}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(stats.bestScore)}%</div>
          <div className="text-sm text-gray-600">Best Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.problemsAttempted.size}</div>
          <div className="text-sm text-gray-600">Problems</div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Performance by Difficulty</h4>
        <div className="space-y-2">
          {Object.entries(stats.difficultyStats).map(([difficulty, data]) => {
            const average = data.attempted > 0 ? Math.round(data.totalScore / data.attempted) : 0;
            const color = difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'yellow' : 'red';
            
            return (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-${color}-500`}></span>
                  <span className="font-medium">{difficulty}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.attempted} questions • {average}% avg
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Achievements ({stats.achievements.length}/{achievements.length})</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {achievements.map((achievement) => {
            const earned = stats.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  earned 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
                title={achievement.description}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-2xl font-bold text-blue-600">{stats.streak} days</div>
          </div>
          <div className="text-3xl">🔥</div>
        </div>
      </div>
    </div>
  );
}