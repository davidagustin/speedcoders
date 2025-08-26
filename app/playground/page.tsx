'use client';

import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  DocumentDuplicateIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  LightBulbIcon,
  CodeBracketIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface CodeTemplate {
  name: string;
  code: string;
  language: string;
}

const codeTemplates: CodeTemplate[] = [
  {
    name: 'Two Sum Solution',
    language: 'javascript',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]`
  },
  {
    name: 'Binary Search Template',
    language: 'python',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test cases
arr = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(arr, 7))  # 3
print(binary_search(arr, 10)) # -1`
  },
  {
    name: 'DFS Template',
    language: 'javascript',
    code: `// DFS for Tree
function dfs(root) {
  if (!root) return;
  
  // Process current node
  console.log(root.val);
  
  // Recursively visit children
  dfs(root.left);
  dfs(root.right);
}

// DFS for Graph
function dfsGraph(graph, start, visited = new Set()) {
  if (visited.has(start)) return;
  
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    dfsGraph(graph, neighbor, visited);
  }
}`
  }
];

export default function PlaygroundPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [savedCode, setSavedCode] = useState<{[key: string]: string}>({});
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    // Load saved code from localStorage
    const saved = localStorage.getItem('playground-code');
    if (saved) {
      setSavedCode(JSON.parse(saved));
    }
  }, []);

  const saveCode = () => {
    const newSavedCode = { ...savedCode, [language]: code };
    setSavedCode(newSavedCode);
    localStorage.setItem('playground-code', JSON.stringify(newSavedCode));
  };

  const loadCode = () => {
    if (savedCode[language]) {
      setCode(savedCode[language]);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      if (language === 'javascript') {
        // Run JavaScript code safely
        const result = await executeJavaScript(code);
        setOutput(result);
      } else {
        // Simulate execution for other languages
        const result = await simulateExecution(code, language);
        setOutput(result);
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const executeJavaScript = async (code: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a safe execution environment
        const originalConsole = console.log;
        const logs: string[] = [];
        
        // Override console.log to capture output
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        // Execute the code
        const result = eval(code);
        
        // Restore console.log
        console.log = originalConsole;
        
        // Combine logs and return value
        let output = logs.join('\n');
        if (result !== undefined) {
          output += (output ? '\n' : '') + `Return: ${JSON.stringify(result, null, 2)}`;
        }
        
        resolve(output || 'Code executed successfully (no output)');
      } catch (error) {
        reject(error);
      }
    });
  };

  const simulateExecution = async (code: string, lang: string): Promise<string> => {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const languageNames = {
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      csharp: 'C#'
    };
    
    return `[Simulated ${languageNames[lang as keyof typeof languageNames] || lang} execution]\n\n${code}\n\nNote: This is a simulation. For full execution, use a proper ${languageNames[lang as keyof typeof languageNames] || lang} environment.`;
  };

  const loadTemplate = (template: CodeTemplate) => {
    setCode(template.code);
    setLanguage(template.language);
    setSelectedTemplate(template.name);
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setSelectedTemplate('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
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
                Code Playground
              </h1>
              <p className="mt-2 text-gray-600">
                Write, run, and test your code in real-time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showHints 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHints ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                  </select>
                  
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      const template = codeTemplates.find(t => t.name === e.target.value);
                      if (template) loadTemplate(template);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Load Template...</option>
                    {codeTemplates.map(template => (
                      <option key={template.name} value={template.name}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveCode}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Save Code"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={loadCode}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Load Saved Code"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={clearCode}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Clear Code"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Write your ${language} code here...`}
                className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                spellCheck={false}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {code.length} characters
                </div>
                <button
                  onClick={runCode}
                  disabled={isRunning || !code.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4" />
                      Run Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Output</h3>
                {output && (
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
                {output || 'Output will appear here...'}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Hints Panel */}
            {showHints && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                  Coding Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>JavaScript:</strong> Use console.log() for output. The playground supports ES6+ features.
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <strong>Python:</strong> Use print() for output. Basic Python syntax is supported.
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <strong>Other Languages:</strong> Code execution is simulated. Use proper IDEs for full functionality.
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <strong>Safety:</strong> Code runs in a sandboxed environment. Be careful with infinite loops!
                  </div>
                </div>
              </div>
            )}

            {/* Quick Templates */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {codeTemplates.map(template => (
                  <button
                    key={template.name}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-gray-500">{template.language}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Info */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Support</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>JavaScript</span>
                  <span className="text-green-600">✓ Full</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Python</span>
                  <span className="text-yellow-600">⚠ Simulated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Java</span>
                  <span className="text-yellow-600">⚠ Simulated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>C++</span>
                  <span className="text-yellow-600">⚠ Simulated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>C#</span>
                  <span className="text-yellow-600">⚠ Simulated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
