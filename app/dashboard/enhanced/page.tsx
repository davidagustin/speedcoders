import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProblemStats from '@/app/components/ProblemStats'
import LearningPath from '@/app/components/LearningPath'
import ProblemBrowser from '@/app/components/ProblemBrowser'
import QuizCreatorWrapper from '@/app/components/QuizCreatorWrapper'

export default async function EnhancedDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Dashboard</h1>
          <p className="text-xl text-gray-600">Your comprehensive LeetCode learning hub</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quiz Creator & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <QuizCreatorWrapper />
            <ProblemStats />
          </div>

          {/* Right Column - Learning Path & Problem Browser */}
          <div className="lg:col-span-2 space-y-6">
            <LearningPath />
            <ProblemBrowser />
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Algorithm Guide */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Algorithm Guide</h3>
              </div>
              <p className="text-gray-600 mb-4">Learn about different algorithms and their applications in problem-solving.</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View Guide
              </button>
            </div>

            {/* Practice Sets */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Practice Sets</h3>
              </div>
              <p className="text-gray-600 mb-4">Curated problem sets for different skill levels and topics.</p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Browse Sets
              </button>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
              </div>
              <p className="text-gray-600 mb-4">Track your learning progress and identify areas for improvement.</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                View Progress
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="font-medium text-gray-900">Start Daily Challenge</div>
              <div className="text-sm text-gray-600">5 random problems</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="font-medium text-gray-900">Review Mistakes</div>
              <div className="text-sm text-gray-600">Learn from errors</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="font-medium text-gray-900">Study Mode</div>
              <div className="text-sm text-gray-600">No time pressure</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="font-medium text-gray-900">Competition</div>
              <div className="text-sm text-gray-600">Race against time</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
