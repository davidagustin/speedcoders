'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface SeedResult {
  algorithms: { success: boolean; count: number; error: string | null }
  problems: { success: boolean; count: number; error: string | null }
  quizzes: { success: boolean; count: number; error: string | null }
}

interface DatabaseStats {
  users: number
  problems: number
  algorithms: number
  quizzes: number
  quizAttempts: number
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null)
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [
        { count: users },
        { count: problems },
        { count: algorithms },
        { count: quizzes },
        { count: quizAttempts }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('problems').select('*', { count: 'exact', head: true }),
        supabase.from('algorithms').select('*', { count: 'exact', head: true }),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }),
        supabase.from('quiz_attempts').select('*', { count: 'exact', head: true })
      ])

      setStats({
        users: users || 0,
        problems: problems || 0,
        algorithms: algorithms || 0,
        quizzes: quizzes || 0,
        quizAttempts: quizAttempts || 0
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const seedDatabase = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/seed/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (response.ok) {
        setSeedResult(result.results)
        setSuccess(result.message)
        loadStats() // Refresh stats after seeding
      } else {
        setError(result.error || 'Failed to seed database')
      }
    } catch (err) {
      setError('Failed to seed database')
    } finally {
      setLoading(false)
    }
  }

  const clearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Clear all tables in reverse order of dependencies
      await supabase.from('quiz_answers').delete().neq('id', '')
      await supabase.from('quiz_attempts').delete().neq('id', '')
      await supabase.from('quiz_questions').delete().neq('id', '')
      await supabase.from('quizzes').delete().neq('id', '')
      await supabase.from('problems').delete().neq('id', '')
      await supabase.from('algorithms').delete().neq('id', '')

      setSuccess('Database cleared successfully')
      loadStats()
    } catch (err) {
      setError('Failed to clear database')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your SpeedCoders learning platform</p>
        </div>

        {/* Database Statistics */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.users}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Problems</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.problems}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Algorithms</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.algorithms}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Quizzes</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.quizzes}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Attempts</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.quizAttempts}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Database Management</h3>
            
            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={seedDatabase}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Seeding...
                  </>
                ) : (
                  'Seed Database'
                )}
              </button>

              <button
                onClick={clearDatabase}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Database
              </button>

              <button
                onClick={loadStats}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Stats
              </button>
            </div>
          </div>
        </div>

        {/* Seed Results */}
        {seedResult && (
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Seed Results</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Algorithms</h4>
                    <p className="text-sm text-gray-500">Data structures and algorithmic techniques</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seedResult.algorithms.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seedResult.algorithms.success ? 'Success' : 'Failed'}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{seedResult.algorithms.count} items</p>
                    {seedResult.algorithms.error && (
                      <p className="text-xs text-red-600 mt-1">{seedResult.algorithms.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Problems</h4>
                    <p className="text-sm text-gray-500">LeetCode problems with descriptions and examples</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seedResult.problems.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seedResult.problems.success ? 'Success' : 'Failed'}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{seedResult.problems.count} items</p>
                    {seedResult.problems.error && (
                      <p className="text-xs text-red-600 mt-1">{seedResult.problems.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Quizzes</h4>
                    <p className="text-sm text-gray-500">Quiz collections with questions and time limits</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seedResult.quizzes.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seedResult.quizzes.success ? 'Success' : 'Failed'}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{seedResult.quizzes.count} items</p>
                    {seedResult.quizzes.error && (
                      <p className="text-xs text-red-600 mt-1">{seedResult.quizzes.error}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
