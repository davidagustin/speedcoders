"use client";

import { useState } from "react";
import { PlayIcon, StopIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PlaygroundPage() {
	const [code, setCode] = useState(`// Welcome to SpeedCoders Code Playground!
// Write your code here and click Run to execute it.

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example: Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`);

	const [output, setOutput] = useState("");
	const [isRunning, setIsRunning] = useState(false);

	const runCode = () => {
		setIsRunning(true);
		setOutput("");

		try {
			// Capture console.log output
			const originalLog = console.log;
			const logs: string[] = [];
			
			console.log = (...args) => {
				logs.push(args.map(arg => 
					typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
				).join(' '));
			};

			// Execute the code
			eval(code);

			// Restore console.log
			console.log = originalLog;

			// Display output
			setOutput(logs.join('\n'));
		} catch (error) {
			setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			setIsRunning(false);
		}
	};

	const clearOutput = () => {
		setOutput("");
	};

	const resetCode = () => {
		setCode(`// Welcome to SpeedCoders Code Playground!
// Write your code here and click Run to execute it.

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example: Calculate first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`);
		setOutput("");
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Code Playground</h1>
					<p className="text-gray-600">Practice coding with real-time execution</p>
				</div>

				{/* Controls */}
				<div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
					<div className="flex items-center gap-4">
						<button
							onClick={runCode}
							disabled={isRunning}
							className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<PlayIcon className="h-4 w-4" />
							{isRunning ? "Running..." : "Run Code"}
						</button>

						<button
							onClick={clearOutput}
							className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
						>
							<StopIcon className="h-4 w-4" />
							Clear Output
						</button>

						<button
							onClick={resetCode}
							className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							<ArrowPathIcon className="h-4 w-4" />
							Reset Code
						</button>
					</div>
				</div>

				{/* Code Editor and Output */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Code Editor */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="p-4 border-b bg-gray-50">
							<h3 className="font-semibold text-gray-900">Code Editor</h3>
							<p className="text-sm text-gray-600">Write your JavaScript code here</p>
						</div>
						<textarea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full h-96 p-4 font-mono text-sm border-0 focus:ring-0 resize-none"
							placeholder="Write your code here..."
							spellCheck={false}
						/>
					</div>

					{/* Output */}
					<div className="bg-white rounded-lg shadow-sm border">
						<div className="p-4 border-b bg-gray-50">
							<h3 className="font-semibold text-gray-900">Output</h3>
							<p className="text-sm text-gray-600">Console output will appear here</p>
						</div>
						<div className="p-4">
							<pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap min-h-96">
								{output || "// Output will appear here when you run your code"}
							</pre>
						</div>
					</div>
				</div>

				{/* Tips */}
				<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
					<h3 className="font-semibold text-blue-900 mb-3">💡 Tips</h3>
					<ul className="text-blue-800 space-y-2 text-sm">
						<li>• Use <code className="bg-blue-100 px-1 rounded">console.log()</code> to see output</li>
						<li>• Try different algorithms and data structures</li>
						<li>• Test your solutions to coding problems</li>
						<li>• Experiment with JavaScript features</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
