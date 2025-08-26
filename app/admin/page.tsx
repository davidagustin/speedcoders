'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async (endpoint: string) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/seed/${endpoint}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed/clear', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Comprehensive Seeding */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Complete Data Seeding</h2>
              <button
                onClick={() => handleSeed('all-batches-complete')}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Seeding...' : 'Seed All Batches (1-5) Complete'}
              </button>
              <p className="text-sm text-blue-700 mt-2">
                Seeds problems, algorithms, learning paths, system designs, and quizzes from all batches
              </p>
            </div>

            {/* Individual Batch Seeding */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Individual Batch Seeding</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleSeed('batch3-complete')}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 3 Complete'}
                </button>
                <button
                  onClick={() => handleSeed('batch4-complete')}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 4 Complete'}
                </button>
                <button
                  onClick={() => handleSeed('batch5-problems')}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 5 Problems'}
                </button>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Seed comprehensive problems from individual batches
              </p>
            </div>

            {/* Legacy Seeding */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">Legacy Seeding</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleSeed('all')}
                  disabled={loading}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed All (Legacy)'}
                </button>
                <button
                  onClick={() => handleSeed('all-batches')}
                  disabled={loading}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed All Batches (Legacy)'}
                </button>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Legacy seeding routes for backward compatibility
              </p>
            </div>

            {/* Specific Component Seeding */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Component Seeding</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleSeed('quizzes')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Quizzes'}
                </button>
                <button
                  onClick={() => handleSeed('advanced-quizzes')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Advanced Quizzes'}
                </button>
                <button
                  onClick={() => handleSeed('batch2-problems')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 2 Problems'}
                </button>
                <button
                  onClick={() => handleSeed('batch3-problems')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 3 Problems'}
                </button>
                <button
                  onClick={() => handleSeed('batch4-problems')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Seeding...' : 'Seed Batch 4 Problems'}
                </button>
              </div>
              <p className="text-sm text-purple-700 mt-2">
                Seed specific components and legacy batch problems
              </p>
            </div>

            {/* Database Management */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Database Management</h2>
              <button
                onClick={handleClear}
                disabled={loading}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Clearing...' : 'Clear All Data'}
              </button>
              <p className="text-sm text-red-700 mt-2">
                ⚠️ Warning: This will delete all seeded data
              </p>
            </div>

            {/* Stats Display */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Stats</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Problems: <span className="font-semibold">150+</span></p>
                <p className="text-gray-600">Algorithms: <span className="font-semibold">24+</span></p>
                <p className="text-gray-600">Learning Paths: <span className="font-semibold">9+</span></p>
                <p className="text-gray-600">System Designs: <span className="font-semibold">10+</span></p>
                <p className="text-gray-600">Quizzes: <span className="font-semibold">24+</span></p>
                <p className="text-gray-600">Batches: <span className="font-semibold">1-5</span></p>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                Comprehensive coverage across all difficulty levels
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Recommended Seeding Order</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li><strong>Seed All Batches (1-5) Complete</strong> - Recommended for full setup</li>
              <li>Or use individual batch seeding for specific needs</li>
              <li>Use component seeding for targeted additions</li>
              <li>Clear data if you need to start fresh</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
