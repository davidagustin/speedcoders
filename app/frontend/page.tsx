'use client';

import { useState } from 'react';
import { 
  CodeBracketIcon, 
  EyeIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface FrontendTrick {
  id: string;
  title: string;
  description: string;
  category: 'CSS' | 'JavaScript' | 'React' | 'HTML' | 'Performance';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  code: string;
  explanation: string;
  useCases: string[];
  tags: string[];
}

const frontendTricks: FrontendTrick[] = [
  {
    id: 'css-grid-centering',
    title: 'Perfect CSS Grid Centering',
    description: 'Center any element both horizontally and vertically using CSS Grid',
    category: 'CSS',
    difficulty: 'Beginner',
    code: `.centered {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
    explanation: 'The `place-items: center` property is a shorthand for both `align-items: center` and `justify-items: center`, making it perfect for centering content in a grid container.',
    useCases: ['Modal dialogs', 'Loading spinners', 'Hero sections', 'Card layouts'],
    tags: ['centering', 'grid', 'layout']
  },
  {
    id: 'js-debounce',
    title: 'Debounce Function',
    description: 'Create a debounced function that delays execution until after a specified delay',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    code: `function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const debouncedSearch = debounce(searchFunction, 300);`,
    explanation: 'Debouncing prevents a function from being called too frequently. It waits until the user stops calling the function for the specified delay before executing it.',
    useCases: ['Search inputs', 'Window resize handlers', 'Scroll events', 'API calls'],
    tags: ['performance', 'events', 'optimization']
  },
  {
    id: 'react-memo',
    title: 'React.memo for Performance',
    description: 'Optimize React components by preventing unnecessary re-renders',
    category: 'React',
    difficulty: 'Intermediate',
    code: `import React from 'react';

const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});

// Custom comparison function
const CustomComponent = React.memo(
  ({ data }) => <div>{data}</div>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);`,
    explanation: 'React.memo is a higher-order component that memoizes your component. It only re-renders if the props have changed, preventing unnecessary re-renders.',
    useCases: ['List items', 'Heavy components', 'Frequently updated components', 'Performance optimization'],
    tags: ['performance', 'optimization', 'memoization']
  },
  {
    id: 'css-custom-properties',
    title: 'CSS Custom Properties (Variables)',
    description: 'Use CSS custom properties for dynamic theming and reusable values',
    category: 'CSS',
    difficulty: 'Beginner',
    code: `:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}

/* Dynamic theming */
[data-theme="dark"] {
  --primary-color: #0056b3;
  --secondary-color: #495057;
}`,
    explanation: 'CSS custom properties allow you to define reusable values that can be used throughout your stylesheet. They support dynamic updates and are perfect for theming.',
    useCases: ['Theme switching', 'Design systems', 'Responsive design', 'Component libraries'],
    tags: ['theming', 'variables', 'maintainability']
  },
  {
    id: 'js-optional-chaining',
    title: 'Optional Chaining Operator',
    description: 'Safely access nested object properties without throwing errors',
    category: 'JavaScript',
    difficulty: 'Beginner',
    code: `// Before (error-prone)
const userName = user && user.profile && user.profile.name;

// After (safe and clean)
const userName = user?.profile?.name;

// With default values
const displayName = user?.profile?.name ?? 'Anonymous';

// Function calls
const result = api?.getData?.();

// Array access
const firstItem = array?.[0];`,
    explanation: 'The optional chaining operator (?.) allows you to read the value of a property located deep within a chain of connected objects without having to validate each reference in the chain.',
    useCases: ['API responses', 'Nested objects', 'Form data', 'Configuration objects'],
    tags: ['safety', 'null-checking', 'modern-js']
  },
  {
    id: 'css-flexbox-layout',
    title: 'Flexbox Holy Grail Layout',
    description: 'Create a responsive layout with header, footer, sidebar, and main content',
    category: 'CSS',
    difficulty: 'Intermediate',
    code: `.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  flex: 0 0 auto;
}

.main {
  display: flex;
  flex: 1;
}

.sidebar {
  flex: 0 0 250px;
}

.content {
  flex: 1;
}

.footer {
  flex: 0 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .main {
    flex-direction: column;
  }
  
  .sidebar {
    flex: 0 0 auto;
  }
}`,
    explanation: 'This layout uses flexbox to create a responsive page structure that adapts to different screen sizes. The main content area grows to fill available space.',
    useCases: ['Dashboard layouts', 'Admin panels', 'Documentation sites', 'Web applications'],
    tags: ['layout', 'responsive', 'flexbox']
  },
  {
    id: 'react-custom-hooks',
    title: 'Custom React Hooks',
    description: 'Create reusable custom hooks for common functionality',
    category: 'React',
    difficulty: 'Advanced',
    code: `import { useState, useEffect } from 'react';

// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useApi(\`/api/users/\${userId}\`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{user.name}</div>;
}`,
    explanation: 'Custom hooks allow you to extract component logic into reusable functions. They can use other hooks and provide a clean way to share stateful logic between components.',
    useCases: ['API calls', 'Form handling', 'Local storage', 'Event listeners', 'Animations'],
    tags: ['reusability', 'composition', 'logic-extraction']
  },
  {
    id: 'js-array-methods',
    title: 'Modern Array Methods',
    description: 'Use modern JavaScript array methods for cleaner, more readable code',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    code: `// Transform data
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

// Map: transform each item
const names = users.map(user => user.name);

// Filter: get items that match condition
const youngUsers = users.filter(user => user.age < 30);

// Reduce: combine all items into single value
const totalAge = users.reduce((sum, user) => sum + user.age, 0);

// Find: get first item that matches
const bob = users.find(user => user.name === 'Bob');

// Some: check if any item matches
const hasYoungUser = users.some(user => user.age < 25);

// Every: check if all items match
const allAdults = users.every(user => user.age >= 18);`,
    explanation: 'Modern array methods provide a functional programming approach to working with arrays. They are more readable and often more performant than traditional loops.',
    useCases: ['Data transformation', 'Filtering lists', 'Calculations', 'Validation', 'Search'],
    tags: ['functional-programming', 'arrays', 'modern-js']
  }
];

export default function FrontendPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrick, setSelectedTrick] = useState<FrontendTrick | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(frontendTricks.map(trick => trick.category)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTricks = frontendTricks.filter(trick => {
    const matchesCategory = selectedCategory === 'All' || trick.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || trick.difficulty === selectedDifficulty;
    const matchesSearch = trick.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trick.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trick.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const copyToClipboard = async (code: string, trickId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(trickId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CSS': return 'text-blue-600 bg-blue-100';
      case 'JavaScript': return 'text-yellow-600 bg-yellow-100';
      case 'React': return 'text-cyan-600 bg-cyan-100';
      case 'HTML': return 'text-orange-600 bg-orange-100';
      case 'Performance': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <CodeBracketIcon className="h-8 w-8 text-blue-600" />
                Frontend Tricks
              </h1>
              <p className="mt-2 text-gray-600">
                Essential frontend techniques and best practices
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tricks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-500">
                {filteredTricks.length} tricks found
              </div>
            </div>

            {/* Tricks List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Tricks</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredTricks.map(trick => (
                  <div
                    key={trick.id}
                    onClick={() => setSelectedTrick(trick)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTrick?.id === trick.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{trick.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(trick.difficulty)}`}>
                        {trick.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{trick.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(trick.category)}`}>
                        {trick.category}
                      </span>
                      <div className="flex gap-1">
                        {trick.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                        {trick.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{trick.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trick Details */}
          <div className="lg:col-span-2">
            {selectedTrick ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrick.title}</h2>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(selectedTrick.category)}`}>
                        {selectedTrick.category}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(selectedTrick.difficulty)}`}>
                        {selectedTrick.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{selectedTrick.description}</p>

                {/* Code Example */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Code Example</h3>
                    <button
                      onClick={() => copyToClipboard(selectedTrick.code, selectedTrick.id)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {copiedCode === selectedTrick.id ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedTrick.code}</code>
                  </pre>
                </div>

                {/* Explanation */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                    Explanation
                  </h3>
                  <p className="text-gray-700">{selectedTrick.explanation}</p>
                </div>

                {/* Use Cases */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Cases</h3>
                  <ul className="space-y-1">
                    {selectedTrick.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrick.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Trick</h3>
                <p className="text-gray-600">Choose a frontend trick from the list to view its details and code examples.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}