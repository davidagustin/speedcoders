'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProblems, LeetCodeProblem } from '@/lib/leetcode-problems';
import { createClient } from '@/utils/supabase/client';

interface Battle {
  id: string;
  player1: {
    id: string;
    name: string;
    score: number;
    progress: number;
    answers: string[];
  };
  player2: {
    id: string;
    name: string;
    score: number;
    progress: number;
    answers: string[];
  };
  problems: LeetCodeProblem[];
  timeLimit: number;
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
}

export default function ArenaPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'solo' | 'multiplayer' | 'tournament'>('solo');
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [ranking, setRanking] = useState<number | null>(null);
  const [battleHistory, setBattleHistory] = useState<any[]>([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  // Simulated WebSocket for real-time updates
  useEffect(() => {
    if (currentBattle?.status === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentBattle?.status === 'active') {
      endBattle();
    }
  }, [currentBattle, timeRemaining]);

  // Simulate opponent progress
  useEffect(() => {
    if (currentBattle?.status === 'active') {
      const interval = setInterval(() => {
        setOpponentProgress(prev => Math.min(prev + Math.random() * 10, 100));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentBattle]);

  const startSoloBattle = () => {
    const problems = getAllProblems()
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const battle: Battle = {
      id: Date.now().toString(),
      player1: {
        id: 'user',
        name: 'You',
        score: 0,
        progress: 0,
        answers: []
      },
      player2: {
        id: 'ai',
        name: 'AI Opponent',
        score: 0,
        progress: 0,
        answers: []
      },
      problems,
      timeLimit: 300,
      status: 'active'
    };

    setCurrentBattle(battle);
    setTimeRemaining(300);
    setCurrentProblemIndex(0);
    setOpponentProgress(0);
  };

  const findMatch = () => {
    setWaitingForOpponent(true);
    
    // Simulate finding an opponent
    setTimeout(() => {
      const problems = getAllProblems()
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const opponents = ['CodeMaster', 'AlgoNinja', 'ByteWarrior', 'LoopWizard'];
      const battle: Battle = {
        id: Date.now().toString(),
        player1: {
          id: 'user',
          name: 'You',
          score: 0,
          progress: 0,
          answers: []
        },
        player2: {
          id: 'opponent',
          name: opponents[Math.floor(Math.random() * opponents.length)],
          score: 0,
          progress: 0,
          answers: []
        },
        problems,
        timeLimit: 300,
        status: 'active'
      };

      setCurrentBattle(battle);
      setTimeRemaining(300);
      setWaitingForOpponent(false);
      setCurrentProblemIndex(0);
      setOpponentProgress(0);
    }, 2000);
  };

  const submitAnswer = () => {
    if (!currentBattle) return;

    const problem = currentBattle.problems[currentProblemIndex];
    const isCorrect = selectedAnswers.every(a => 
      problem.algorithms.includes(a) || 
      problem.dataStructures.includes(a) || 
      problem.techniques.includes(a)
    );

    const newBattle = { ...currentBattle };
    newBattle.player1.score += isCorrect ? 100 : 0;
    newBattle.player1.progress = ((currentProblemIndex + 1) / currentBattle.problems.length) * 100;
    setCurrentBattle(newBattle);

    if (currentProblemIndex < currentBattle.problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setSelectedAnswers([]);
    } else {
      endBattle();
    }
  };

  const endBattle = () => {
    if (!currentBattle) return;

    const playerScore = currentBattle.player1.score;
    const opponentScore = Math.floor(Math.random() * 400 + 100);

    const updatedBattle = {
      ...currentBattle,
      status: 'completed' as const,
      winner: playerScore > opponentScore ? 'user' : 'opponent',
      player2: {
        ...currentBattle.player2,
        score: opponentScore
      }
    };

    setCurrentBattle(updatedBattle);
    setBattleHistory(prev => [...prev, updatedBattle]);
  };

  const getLeaderboard = () => {
    return [
      { rank: 1, name: 'LeetKing', rating: 2450, wins: 342, battles: 380 },
      { rank: 2, name: 'AlgoMaster', rating: 2380, wins: 298, battles: 340 },
      { rank: 3, name: 'CodeSamurai', rating: 2290, wins: 245, battles: 290 },
      { rank: 4, name: 'ByteNinja', rating: 2210, wins: 201, battles: 250 },
      { rank: 5, name: 'You', rating: 2150, wins: 178, battles: 220 },
      { rank: 6, name: 'LoopLord', rating: 2090, wins: 156, battles: 200 },
      { rank: 7, name: 'ArrayWizard', rating: 2020, wins: 134, battles: 180 },
      { rank: 8, name: 'RecursionKing', rating: 1980, wins: 112, battles: 160 }
    ];
  };

  const getTournaments = () => {
    return [
      {
        id: 1,
        name: 'Weekly Championship',
        prize: '500 XP + Badge',
        participants: 128,
        startTime: '2 hours',
        difficulty: 'Mixed',
        status: 'upcoming'
      },
      {
        id: 2,
        name: 'Daily Sprint',
        prize: '100 XP',
        participants: 32,
        startTime: '30 min',
        difficulty: 'Medium',
        status: 'upcoming'
      },
      {
        id: 3,
        name: 'Beginner Friendly',
        prize: '50 XP',
        participants: 64,
        startTime: '1 hour',
        difficulty: 'Easy',
        status: 'open'
      }
    ];
  };

  if (waitingForOpponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
          <div className="animate-pulse mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Finding Opponent...</h2>
            <p className="text-blue-200">Matching you with a worthy challenger</p>
          </div>
          <button
            onClick={() => setWaitingForOpponent(false)}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (currentBattle?.status === 'active') {
    const problem = currentBattle.problems[currentProblemIndex];
    const progress = (currentProblemIndex / currentBattle.problems.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Battle Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-white">
                <h3 className="font-bold text-lg">{currentBattle.player1.name}</h3>
                <div className="text-3xl font-bold">{currentBattle.player1.score}</div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-white mt-2">
                  Problem {currentProblemIndex + 1} of {currentBattle.problems.length}
                </div>
              </div>
              
              <div className="text-white text-right">
                <h3 className="font-bold text-lg">{currentBattle.player2.name}</h3>
                <div className="text-3xl font-bold">{currentBattle.player2.score}</div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all"
                    style={{ width: `${opponentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Problem Card */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-sm ${
                  problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {problem.difficulty}
                </span>
                {problem.category.slice(0, 2).map(cat => (
                  <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select ALL that apply:</h3>
              <div className="grid grid-cols-2 gap-3">
                {[...problem.algorithms, ...problem.dataStructures, ...problem.techniques,
                  'Binary Search Tree', 'Heap Sort', 'Topological Sort', 'Union Find']
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 8)
                  .map(option => (
                    <label
                      key={option}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                        selectedAnswers.includes(option)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAnswers.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnswers([...selectedAnswers, option]);
                          } else {
                            setSelectedAnswers(selectedAnswers.filter(a => a !== option));
                          }
                        }}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
              </div>
            </div>

            <button
              onClick={submitAnswer}
              disabled={selectedAnswers.length === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentBattle?.status === 'completed') {
    const isWinner = currentBattle.winner === 'user';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl p-12 max-w-2xl w-full text-center">
          <h1 className={`text-4xl font-bold mb-4 ${isWinner ? 'text-green-600' : 'text-red-600'}`}>
            {isWinner ? '🏆 Victory!' : '💪 Defeat'}
          </h1>
          
          <div className="grid grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">{currentBattle.player1.name}</h3>
              <div className="text-3xl font-bold">{currentBattle.player1.score}</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{currentBattle.player2.name}</h3>
              <div className="text-3xl font-bold">{currentBattle.player2.score}</div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2">XP Earned</div>
            <div className="text-2xl font-bold text-blue-600">
              +{isWinner ? 150 : 50} XP
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentBattle(null)}
              className="flex-1 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back to Arena
            </button>
            <button
              onClick={mode === 'solo' ? startSoloBattle : findMatch}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              Battle Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">⚔️ Coding Arena</h1>
          <p className="text-xl text-blue-200">Compete in real-time algorithm battles</p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('solo')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              mode === 'solo'
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Solo Practice
          </button>
          <button
            onClick={() => setMode('multiplayer')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              mode === 'multiplayer'
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Multiplayer
          </button>
          <button
            onClick={() => setMode('tournament')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              mode === 'tournament'
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Tournaments
          </button>
        </div>

        {mode === 'solo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">🤖 AI Battle</h2>
              <p className="text-gray-600 mb-6">
                Practice against AI opponents of varying difficulty
              </p>
              <div className="space-y-4">
                <button
                  onClick={startSoloBattle}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-blue-600"
                >
                  Start Easy Battle
                </button>
                <button
                  onClick={startSoloBattle}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600"
                >
                  Start Medium Battle
                </button>
                <button
                  onClick={startSoloBattle}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-bold hover:from-red-600 hover:to-pink-600"
                >
                  Start Hard Battle
                </button>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">📊 Your Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Battles</span>
                  <span className="font-bold">{battleHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-bold">
                    {battleHistory.length > 0
                      ? Math.round((battleHistory.filter(b => b.winner === 'user').length / battleHistory.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-bold">3 🔥</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ranking</span>
                  <span className="font-bold">#2,150</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'multiplayer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/95 backdrop-blur rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">🎮 Quick Match</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-bold text-lg mb-1">Speed Battle</h3>
                  <p className="text-sm opacity-90 mb-4">5 problems, 5 minutes</p>
                  <button
                    onClick={findMatch}
                    className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30"
                  >
                    Find Match
                  </button>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-bold text-lg mb-1">Accuracy Battle</h3>
                  <p className="text-sm opacity-90 mb-4">10 problems, no time limit</p>
                  <button
                    onClick={findMatch}
                    className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30"
                  >
                    Find Match
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Recent Battles</h3>
              <div className="space-y-2">
                {battleHistory.slice(-3).reverse().map((battle, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        battle.winner === 'user' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span>vs {battle.player2.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">{battle.player1.score}</span>
                      <span className="mx-2">-</span>
                      <span className="font-bold">{battle.player2.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
              <div className="space-y-2">
                {getLeaderboard().map(player => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      player.name === 'You' ? 'bg-blue-50 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">#{player.rank}</span>
                      <span>{player.name}</span>
                    </div>
                    <span className="text-sm">{player.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'tournament' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTournaments().map(tournament => (
              <div key={tournament.id} className="bg-white/95 backdrop-blur rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{tournament.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    tournament.status === 'open' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tournament.status === 'open' ? 'Open' : `Starts in ${tournament.startTime}`}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prize Pool</span>
                    <span className="font-medium">{tournament.prize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">{tournament.participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium">{tournament.difficulty}</span>
                  </div>
                </div>
                
                <button
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    tournament.status === 'open'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={tournament.status !== 'open'}
                >
                  {tournament.status === 'open' ? 'Join Tournament' : 'Registration Closed'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}