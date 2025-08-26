import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProblemStats from '@/app/components/ProblemStats'
import LearningPath from '@/app/components/LearningPath'
import EnhancedProblemBrowser from '@/app/components/EnhancedProblemBrowser'
import QuizCreatorWrapper from '@/app/components/QuizCreatorWrapper'

export default async function EnhancedDashboard() {
  const supabase = await createClient()
  const { data: { user }, } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Dashboard</h1>
        <p className="text-gray-600 mb-8">Master algorithms with our comprehensive LeetCode-style platform</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <QuizCreatorWrapper />
            <ProblemStats />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <LearningPath />
          </div>
        </div>

        {/* Enhanced Problem Browser Section */}
        <div className="mt-12">
          <EnhancedProblemBrowser 
            onSelectProblems={(problems) => {
              console.log('Selected problems:', problems);
            }}
            onCreateQuiz={(problems) => {
              console.log('Creating quiz with problems:', problems);
            }}
          />
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Editorial System</h3>
              <p className="text-gray-600">Detailed explanations and multiple solution approaches for each problem</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Track your performance and identify areas for improvement</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Paths</h3>
              <p className="text-gray-600">Structured learning paths to master algorithms systematically</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition-all">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Start Quiz</div>
              <div className="text-sm opacity-90">Quick practice session</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition-all">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold">Browse Problems</div>
              <div className="text-sm opacity-90">Find specific topics</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">View Analytics</div>
              <div className="text-sm opacity-90">Track your progress</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition-all">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold">Study Plans</div>
              <div className="text-sm opacity-90">Structured learning</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
