'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QuizCreator from './QuizCreator'

export default function QuizCreatorWrapper() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateQuiz = async (config: {
    problemCount: number
    difficulty: string
    category: string | null
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user',
          problemCount: config.problemCount,
          difficulty: config.difficulty,
          category: config.category
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/quiz/${data.attempt.quiz.id}`)
      } else {
        console.error('Failed to create quiz')
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <QuizCreator
      onCreateQuiz={handleCreateQuiz}
      isLoading={isLoading}
    />
  )
}