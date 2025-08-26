'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface StudySession {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  topics: string[];
  problems: string[];
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: string;
}

interface StudyPlannerProps {
  onCreateQuiz: (problems: string[]) => void;
}

export default function StudyPlanner({ onCreateQuiz }: StudyPlannerProps) {
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Array Fundamentals',
      date: '2024-01-15',
      duration: 60,
      topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum'],
      problems: ['Two Sum', 'Container With Most Water', '3Sum'],
      completed: false,
      priority: 'High'
    },
    {
      id: '2',
      title: 'Dynamic Programming Basics',
      date: '2024-01-16',
      duration: 90,
      topics: ['1D DP', 'Kadane\'s Algorithm'],
      problems: ['Climbing Stairs', 'House Robber', 'Maximum Subarray'],
      completed: true,
      priority: 'Medium'
    },
    {
      id: '3',
      title: 'Tree Traversal Practice',
      date: '2024-01-17',
      duration: 45,
      topics: ['DFS', 'BFS', 'Tree Properties'],
      problems: ['Invert Binary Tree', 'Maximum Depth', 'Symmetric Tree'],
      completed: false,
      priority: 'Medium'
    }
  ]);

  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([
    {
      id: '1',
      title: 'Daily Problem Solving',
      description: 'Solve at least 3 LeetCode problems daily',
      target: 90,
      current: 67,
      unit: 'problems',
      deadline: '2024-01-31',
      category: 'Practice'
    },
    {
      id: '2',
      title: 'Algorithm Mastery',
      description: 'Master 15 core algorithm patterns',
      target: 15,
      current: 8,
      unit: 'algorithms',
      deadline: '2024-02-15',
      category: 'Learning'
    },
    {
      id: '3',
      title: 'Study Time',
      description: 'Dedicate 2 hours daily to coding practice',
      target: 60,
      current: 42,
      unit: 'hours',
      deadline: '2024-01-31',
      category: 'Time'
    }
  ]);

  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    title: '',
    date: '',
    duration: 60,
    topics: [],
    problems: [],
    priority: 'Medium'
  });

  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    category: 'Practice'
  });

  const toggleSessionComplete = (sessionId: string) => {
    setStudySessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, completed: !session.completed }
          : session
      )
    );
  };

  const deleteSession = (sessionId: string) => {
    setStudySessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const deleteGoal = (goalId: string) => {
    setStudyGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const addNewSession = () => {
    if (newSession.title && newSession.date) {
      const session: StudySession = {
        id: Date.now().toString(),
        title: newSession.title || '',
        date: newSession.date || '',
        duration: newSession.duration || 60,
        topics: newSession.topics || [],
        problems: newSession.problems || [],
        completed: false,
        priority: newSession.priority || 'Medium'
      };
      setStudySessions(prev => [...prev, session]);
      setNewSession({
        title: '',
        date: '',
        duration: 60,
        topics: [],
        problems: [],
        priority: 'Medium'
      });
      setShowNewSession(false);
    }
  };

  const addNewGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal: StudyGoal = {
        id: Date.now().toString(),
        title: newGoal.title || '',
        description: newGoal.description || '',
        target: newGoal.target || 0,
        current: newGoal.current || 0,
        unit: newGoal.unit || '',
        deadline: newGoal.deadline || '',
        category: newGoal.category || 'Practice'
      };
      setStudyGoals(prev => [...prev, goal]);
      setNewGoal({
        title: '',
        description: '',
        target: 0,
        current: 0,
        unit: '',
        deadline: '',
        category: 'Practice'
      });
      setShowNewGoal(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Practice': return 'bg-blue-100 text-blue-800';
      case 'Learning': return 'bg-purple-100 text-purple-800';
      case 'Time': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingSessions = studySessions
    .filter(session => !session.completed && new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedSessions = studySessions.filter(session => session.completed);

  return (
    <div className="space-y-6">
      {/* Study Goals */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            Study Goals
          </h2>
          <button
            onClick={() => setShowNewGoal(true)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span className="text-gray-500">Due: {goal.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Sessions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            Study Sessions
          </h2>
          <button
            onClick={() => setShowNewSession(true)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Session
          </button>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => toggleSessionComplete(session.id)}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(session.priority)}`}>
                        {session.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {session.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {session.duration}m
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {session.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {session.problems.slice(0, 3).map((problem, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {problem}
                        </span>
                      ))}
                      {session.problems.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{session.problems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCreateQuiz(session.problems)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Start
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {upcomingSessions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming study sessions scheduled.</p>
            )}
          </div>
        </div>

        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Completed Sessions</h3>
            <div className="space-y-3">
              {completedSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700">{session.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{session.date}</span>
                        <span>{session.duration}m</span>
                        <span>{session.problems.length} problems</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Study Session</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newSession.title || ''}
                  onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Array Problems Practice"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newSession.date || ''}
                  onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newSession.duration || 60}
                  onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newSession.priority || 'Medium'}
                  onChange={(e) => setNewSession(prev => ({ ...prev, priority: e.target.value as StudySession['priority'] }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewSession(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewSession}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Master Binary Search"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your goal..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current</label>
                  <input
                    type="number"
                    value={newGoal.current || 0}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, current: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input
                    type="number"
                    value={newGoal.target || 0}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., problems, hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGoal.category || 'Practice'}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Practice">Practice</option>
                    <option value="Learning">Learning</option>
                    <option value="Time">Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline || ''}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewGoal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}