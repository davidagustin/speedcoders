'use client'

import { useState, useEffect } from 'react'
import { 
  ServerIcon, 
  CircleStackIcon as DatabaseIcon, 
  CloudIcon, 
  GlobeAltIcon,
  CpuChipIcon,
  WifiIcon,
  ChartBarIcon,
  ClockIcon,
  ScaleIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

interface SystemDesignProblem {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  requirements: string[]
  constraints: string[]
  components: string[]
  solutions: string[]
  estimatedTime: number
  tags: string[]
  scale: string
  technologies: string[]
  architecture: string[]
  tradeoffs: string[]
  metrics: string[]
}

export default function SystemDesignPage() {
  const [designs, setDesigns] = useState<SystemDesignProblem[]>([])
  const [selectedDesign, setSelectedDesign] = useState<SystemDesignProblem | null>(null)
  const [filter, setFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadSystemDesigns()
  }, [filter, searchTerm])

  const loadSystemDesigns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('difficulty', filter)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/system-design?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setDesigns(result.data.problems)
        setStats(result.data.stats)
      } else {
        console.error('Failed to load system designs:', result.error)
      }
    } catch (error) {
      console.error('Error loading system designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Services':
        return <GlobeAltIcon className="w-5 h-5" />
      case 'Real-time Systems':
        return <WifiIcon className="w-5 h-5" />
      case 'API Design':
        return <ServerIcon className="w-5 h-5" />
      case 'Caching':
        return <DatabaseIcon className="w-5 h-5" />
      case 'Search Systems':
        return <ChartBarIcon className="w-5 h-5" />
      case 'Media Systems':
        return <CloudIcon className="w-5 h-5" />
      case 'Social Systems':
        return <WifiIcon className="w-5 h-5" />
      case 'E-commerce':
        return <ServerIcon className="w-5 h-5" />
      default:
        return <CpuChipIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Design</h1>
              <p className="text-gray-600">Master scalable system architecture and design patterns</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CpuChipIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Problems</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ScaleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Easy</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.easy}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ScaleIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Medium</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.medium}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ScaleIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Hard</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.hard}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search system designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'Easy', 'Medium', 'Hard'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setFilter(difficulty as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === difficulty ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* System Designs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {designs.map(design => (
              <div key={design.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(design.category)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(design.difficulty)}`}>
                        {design.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {design.estimatedTime} min
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{design.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{design.description}</p>

                  {/* Scale */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <ScaleIcon className="w-4 h-4" />
                      Scale
                    </div>
                    <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">{design.scale}</p>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <CodeBracketIcon className="w-4 h-4" />
                      Technologies
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {design.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                      {design.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{design.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {design.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {design.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{design.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Requirements Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {design.requirements.slice(0, 2).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                      {design.requirements.length > 2 && (
                        <li className="text-gray-500">+{design.requirements.length - 2} more requirements</li>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedDesign(design)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Start Design
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && designs.length === 0 && (
          <div className="text-center py-12">
            <CpuChipIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No system designs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Design Detail Modal */}
        {selectedDesign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDesign.title}</h2>
                    <p className="text-gray-600 mb-2">{selectedDesign.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedDesign.difficulty)}`}>
                        {selectedDesign.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {selectedDesign.estimatedTime} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <ScaleIcon className="w-4 h-4" />
                        {selectedDesign.scale}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedDesign.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                    <ul className="space-y-2">
                      {selectedDesign.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-red-500 mt-1">•</span>
                          <span className="text-gray-700">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* System Components */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">System Components</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedDesign.components.map((component, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          {component}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Solutions</h3>
                    <ul className="space-y-2">
                      {selectedDesign.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Architecture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Architecture Patterns</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.architecture.map((arch, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded">
                          {arch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trade-offs */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Trade-offs</h3>
                    <ul className="space-y-2">
                      {selectedDesign.tradeoffs.map((tradeoff, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-orange-500 mt-1">•</span>
                          <span className="text-gray-700">{tradeoff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                    <ul className="space-y-2">
                      {selectedDesign.metrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Start Design Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
