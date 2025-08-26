'use client'

import { useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function QuizPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quiz Center</h1>
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Quiz functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}