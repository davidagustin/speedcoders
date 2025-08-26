'use client'

import { useState } from 'react'

interface EditorialSolution {
  name: string
  description: string
  code: string
  explanation: string
}

interface Editorial {
  approach: string
  timeComplexity: string
  spaceComplexity: string
  solutions: EditorialSolution[]
}

interface EditorialViewProps {
  editorial: Editorial
  isVisible: boolean
  onClose: () => void
}

export default function EditorialView({ editorial, isVisible, onClose }: EditorialViewProps) {
  const [activeSolution, setActiveSolution] = useState(0)

  if (!isVisible) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editorial Solution</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Approach */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approach</h3>
          <p className="text-gray-700">{editorial.approach}</p>
        </div>

        {/* Complexity */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Time Complexity</h4>
            <p className="text-blue-700">{editorial.timeComplexity}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-1">Space Complexity</h4>
            <p className="text-green-700">{editorial.spaceComplexity}</p>
          </div>
        </div>

        {/* Solutions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Solutions</h3>
          
          {/* Solution Tabs */}
          {editorial.solutions.length > 1 && (
            <div className="flex space-x-2 mb-4">
              {editorial.solutions.map((solution, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSolution(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSolution === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {solution.name}
                </button>
              ))}
            </div>
          )}

          {/* Active Solution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {editorial.solutions[activeSolution].name}
            </h4>
            <p className="text-gray-700 mb-4">
              {editorial.solutions[activeSolution].description}
            </p>

            {/* Code Block */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 relative">
              <button
                onClick={() => copyToClipboard(editorial.solutions[activeSolution].code)}
                className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
              >
                Copy
              </button>
              <pre className="text-green-400 overflow-x-auto">
                <code>{editorial.solutions[activeSolution].code}</code>
              </pre>
            </div>

            {/* Explanation */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Explanation</h5>
              <p className="text-gray-700">
                {editorial.solutions[activeSolution].explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
