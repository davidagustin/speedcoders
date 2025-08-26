export interface CodeExecutionResult {
	success: boolean;
	output: string;
	error?: string;
	executionTime: number;
	memoryUsage?: number;
	testCases?: TestCaseResult[];
}

export interface TestCaseResult {
	input: string;
	expectedOutput: string;
	actualOutput: string;
	passed: boolean;
	executionTime: number;
}

export interface CodeExecutionRequest {
	code: string;
	language: "javascript" | "python" | "java" | "cpp";
	testCases: {
		input: string;
		expectedOutput: string;
	}[];
	timeLimit?: number;
	memoryLimit?: number;
}

export class CodeExecutor {
	private timeLimit: number = 5000; // 5 seconds

	async executeCode(
		request: CodeExecutionRequest,
	): Promise<CodeExecutionResult> {
		const startTime = Date.now();

		try {
			switch (request.language) {
				case "javascript":
					return await this.executeJavaScript(request);
				case "python":
					return await this.executePython(request);
				case "java":
					return await this.executeJava(request);
				case "cpp":
					return await this.executeCpp(request);
				default:
					throw new Error(`Unsupported language: ${request.language}`);
			}
		} catch (error) {
			return {
				success: false,
				output: "",
				error: error instanceof Error ? error.message : "Unknown error",
				executionTime: Date.now() - startTime,
			};
		}
	}

	private async executeJavaScript(
		request: CodeExecutionRequest,
	): Promise<CodeExecutionResult> {
		const startTime = Date.now();
		const testResults: TestCaseResult[] = [];

		try {
			// Create a safe execution context
			const safeCode = this.wrapJavaScriptCode(request.code);

			for (const testCase of request.testCases) {
				const caseStartTime = Date.now();

				try {
					// Parse input (assuming JSON format for complex inputs)
					let parsedInput;
					try {
						parsedInput = JSON.parse(testCase.input);
					} catch {
						parsedInput = testCase.input;
					}

					// Execute with timeout
					const result = await this.executeWithTimeout(
						safeCode,
						parsedInput,
						this.timeLimit,
					);
					const actualOutput =
						typeof result === "object"
							? JSON.stringify(result)
							: String(result);

					testResults.push({
						input: testCase.input,
						expectedOutput: testCase.expectedOutput,
						actualOutput,
						passed: actualOutput === testCase.expectedOutput,
						executionTime: Date.now() - caseStartTime,
					});
				} catch (error) {
					testResults.push({
						input: testCase.input,
						expectedOutput: testCase.expectedOutput,
						actualOutput: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
						passed: false,
						executionTime: Date.now() - caseStartTime,
					});
				}
			}

			const allPassed = testResults.every((result) => result.passed);

			return {
				success: allPassed,
				output: testResults
					.map((r) => `${r.input} → ${r.actualOutput}`)
					.join("\n"),
				executionTime: Date.now() - startTime,
				testCases: testResults,
			};
		} catch (error) {
			return {
				success: false,
				output: "",
				error: error instanceof Error ? error.message : "Execution failed",
				executionTime: Date.now() - startTime,
				testCases: testResults,
			};
		}
	}

	private wrapJavaScriptCode(code: string): string {
		// Remove any potentially dangerous operations
		const sanitizedCode = code
			.replace(/eval\(/g, "/* eval( */")
			.replace(/Function\(/g, "/* Function( */")
			.replace(/new Function/g, "/* new Function */")
			.replace(/import\s/g, "/* import */")
			.replace(/require\(/g, "/* require( */");

		// Wrap in a function that can be called with test inputs
		return `
      (function(input) {
        ${sanitizedCode}
        
        // Try to find the main function to call
        const functionNames = [
          'twoSum', 'addTwoNumbers', 'lengthOfLongestSubstring', 'isValid', 'maxSubArray',
          'solution', 'solve', 'main'
        ];
        
        for (const name of functionNames) {
          if (typeof window !== 'undefined' && window[name]) {
            if (Array.isArray(input)) {
              return window[name](...input);
            }
            return window[name](input);
          }
          if (typeof global !== 'undefined' && global[name]) {
            if (Array.isArray(input)) {
              return global[name](...input);
            }
            return global[name](input);
          }
          // SECURITY: Removed eval usage - unsafe code execution
          // Function detection would need to be implemented securely server-side
        }
        
        // If no function found, try to return the last expression
        return input;
      })
    `;
	}

	private async executeWithTimeout(
		_code: string,
		_input: any,
		_timeout: number,
	): Promise<any> {
		// SECURITY: Disabled client-side code execution due to security vulnerabilities
		// This would require a secure server-side execution environment
		throw new Error(
			"Code execution disabled for security. Use server-side execution service.",
		);
	}

	private async executePython(
		_request: CodeExecutionRequest,
	): Promise<CodeExecutionResult> {
		// For now, return a mock result as we'd need a Python runtime
		return {
			success: false,
			output: "",
			error:
				"Python execution not implemented - would require server-side runtime",
			executionTime: 0,
		};
	}

	private async executeJava(
		_request: CodeExecutionRequest,
	): Promise<CodeExecutionResult> {
		// For now, return a mock result as we'd need a Java runtime
		return {
			success: false,
			output: "",
			error:
				"Java execution not implemented - would require server-side runtime",
			executionTime: 0,
		};
	}

	private async executeCpp(
		_request: CodeExecutionRequest,
	): Promise<CodeExecutionResult> {
		// For now, return a mock result as we'd need a C++ compiler
		return {
			success: false,
			output: "",
			error:
				"C++ execution not implemented - would require server-side compiler",
			executionTime: 0,
		};
	}

	// Static analysis methods
	analyzeCodeComplexity(code: string): {
		timeComplexity: string;
		spaceComplexity: string;
		cyclomaticComplexity: number;
	} {
		const timeComplexity = this.estimateTimeComplexity(code);
		const spaceComplexity = this.estimateSpaceComplexity(code);
		const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);

		return {
			timeComplexity,
			spaceComplexity,
			cyclomaticComplexity,
		};
	}

	private estimateTimeComplexity(code: string): string {
		// Count nested loops
		const singleLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
		const nestedLoops = (
			code.match(/for.*for|while.*while|for.*while|while.*for/g) || []
		).length;

		// Check for specific patterns
		if (code.includes("sort(")) return "O(n log n)";
		if (nestedLoops >= 2) return "O(n³)";
		if (nestedLoops >= 1) return "O(n²)";
		if (singleLoops >= 1) return "O(n)";
		if (code.includes("Math.log") || code.includes("binary")) return "O(log n)";

		return "O(1)";
	}

	private estimateSpaceComplexity(code: string): string {
		// Check for data structures
		if (code.includes("new Array") || code.includes("[]")) {
			if (code.includes("Array(n)") || code.includes("new Array(n)"))
				return "O(n)";
			return "O(n)";
		}
		if (code.includes("new Map") || code.includes("new Set")) return "O(n)";
		if (code.includes("recursion") || code.includes("function.*function"))
			return "O(n)";

		return "O(1)";
	}

	private calculateCyclomaticComplexity(code: string): number {
		let complexity = 1; // Base complexity

		// Count decision points
		const ifStatements = (code.match(/if\s*\(/g) || []).length;
		const elseStatements = (code.match(/else/g) || []).length;
		const switchCases = (code.match(/case\s+/g) || []).length;
		const loops = (code.match(/for\s*\(|while\s*\(|do\s*{/g) || []).length;
		const ternary = (code.match(/\?.*:/g) || []).length;
		const catches = (code.match(/catch\s*\(/g) || []).length;
		const logicalOps = (code.match(/&&|\|\|/g) || []).length;

		complexity +=
			ifStatements +
			elseStatements +
			switchCases +
			loops +
			ternary +
			catches +
			logicalOps;

		return complexity;
	}
}

export const codeExecutor = new CodeExecutor();
