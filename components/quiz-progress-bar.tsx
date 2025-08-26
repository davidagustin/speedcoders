'use client'

interface QuizProgressBarProps {
  current: number
  total: number
  answers: Array<{ questionId: string; selectedAlgorithms: string[] }>
}

export function QuizProgressBar({ current, total, answers }: QuizProgressBarProps) {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: total }).map((_, index) => {
        const isAnswered = answers.some(a => 
          a.questionId && a.selectedAlgorithms.length > 0
        )
        const isCurrent = index === current
        
        return (
          <div
            key={index}
            className={`
              h-2 flex-1 rounded-full transition-all
              ${
                isCurrent
                  ? 'bg-indigo-600'
                  : index < current
                  ? isAnswered
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                  : 'bg-gray-300'
              }
            `}
          />
        )
      })}
    </div>
  )
}