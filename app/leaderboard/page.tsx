"use client";

import React, { useState, useEffect } from "react";
import { TrophyIcon, StarIcon, FireIcon, UserIcon } from "@heroicons/react/24/outline";

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  score: number;
  problemsSolved: number;
  averageScore: number;
  streak: number;
  avatar?: string;
}

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "active" | "completed";
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all-time");

  useEffect(() => {
    fetchLeaderboardData();
    fetchTournaments();
  }, [selectedTimeframe]);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`/api/leaderboard?timeframe=${selectedTimeframe}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard || []);
      } else {
        // Mock data for demonstration
        setLeaderboardData([
          { id: "1", rank: 1, username: "CodeMaster", score: 2850, problemsSolved: 247, averageScore: 92, streak: 15, avatar: "👑" },
          { id: "2", rank: 2, username: "AlgoWizard", score: 2720, problemsSolved: 234, averageScore: 89, streak: 12, avatar: "🧙‍♂️" },
          { id: "3", rank: 3, username: "DataStruct", score: 2650, problemsSolved: 228, averageScore: 87, streak: 18, avatar: "🏗️" },
          { id: "4", rank: 4, username: "BinarySearch", score: 2580, problemsSolved: 221, averageScore: 85, streak: 10, avatar: "🔍" },
          { id: "5", rank: 5, username: "DynamicPro", score: 2510, problemsSolved: 215, averageScore: 83, streak: 14, avatar: "⚡" },
          { id: "6", rank: 6, username: "TreeTraversal", score: 2440, problemsSolved: 208, averageScore: 81, streak: 9, avatar: "🌳" },
          { id: "7", rank: 7, username: "GraphExplorer", score: 2370, problemsSolved: 201, averageScore: 79, streak: 11, avatar: "🕸️" },
          { id: "8", rank: 8, username: "HashMaster", score: 2300, problemsSolved: 194, averageScore: 77, streak: 8, avatar: "🗝️" },
          { id: "9", rank: 9, username: "StackOverflow", score: 2230, problemsSolved: 187, averageScore: 75, streak: 13, avatar: "📚" },
          { id: "10", rank: 10, username: "QueueManager", score: 2160, problemsSolved: 180, averageScore: 73, streak: 7, avatar: "📋" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await fetch("/api/tournaments");
      if (response.ok) {
        const data = await response.json();
        setTournaments(data.tournaments || []);
      } else {
        // Mock data for demonstration
        setTournaments([
          { id: "1", name: "Weekly Coding Challenge", startDate: "2024-01-15", endDate: "2024-01-22", participants: 156, status: "active" },
          { id: "2", name: "Algorithm Masters", startDate: "2024-01-25", endDate: "2024-02-01", participants: 89, status: "upcoming" },
          { id: "3", name: "Data Structures Showdown", startDate: "2024-01-08", endDate: "2024-01-15", participants: 203, status: "completed" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank.toString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "upcoming": return "text-blue-600 bg-blue-100";
      case "completed": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrophyIcon className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600">Compete with other coders and climb the rankings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Top Coders</h2>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all-time">All Time</option>
                    <option value="monthly">This Month</option>
                    <option value="weekly">This Week</option>
                    <option value="daily">Today</option>
                  </select>
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="divide-y divide-gray-200">
                {leaderboardData.map((entry) => (
                  <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                          <span className="text-2xl">{getRankIcon(entry.rank)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{entry.username}</h3>
                            {entry.rank <= 3 && (
                              <FireIcon className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{entry.problemsSolved} problems solved</span>
                            <span>•</span>
                            <span>{entry.averageScore}% avg score</span>
                            <span>•</span>
                            <span>{entry.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{entry.score}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Rank</span>
                  <span className="font-semibold">#42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Score</span>
                  <span className="font-semibold">1,850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Problems Solved</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold">8 days</span>
                </div>
              </div>
            </div>

            {/* Active Tournaments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournaments</h3>
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <div key={tournament.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{tournament.startDate} - {tournament.endDate}</p>
                      <p>{tournament.participants} participants</p>
                    </div>
                    {tournament.status === "active" && (
                      <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Join Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <StarIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">First Perfect Score</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FireIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">7-Day Streak</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrophyIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Top 50 Rank</p>
                    <p className="text-sm text-gray-600">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
