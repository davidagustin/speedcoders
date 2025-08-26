"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface LanguageTrick {
	id: string;
	title: string;
	description: string;
	language: string;
	category: string;
	code: string;
	explanation: string;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	tags: string[];
}

const languageTricks: LanguageTrick[] = [
	// JavaScript Tricks
	{
		id: "js-1",
		title: "Array Destructuring with Default Values",
		description: "Use destructuring with default values for cleaner code",
		language: "JavaScript",
		category: "Arrays",
		code: `// Instead of this:
const first = arr[0] || 'default';
const second = arr[1] || 'default';

// Use this:
const [first = 'default', second = 'default'] = arr;`,
		explanation:
			"Array destructuring with default values allows you to extract array elements and provide fallback values in a single, clean expression.",
		difficulty: "Beginner",
		tags: ["destructuring", "arrays", "default-values"],
	},
	{
		id: "js-2",
		title: "Object Property Shorthand",
		description:
			"Simplify object creation when property names match variable names",
		language: "JavaScript",
		category: "Objects",
		code: `// Instead of this:
const name = 'John';
const age = 30;
const user = {
  name: name,
  age: age
};

// Use this:
const name = 'John';
const age = 30;
const user = { name, age };`,
		explanation:
			"When the property name matches the variable name, you can use the shorthand syntax to create objects more concisely.",
		difficulty: "Beginner",
		tags: ["objects", "shorthand", "es6"],
	},
	{
		id: "js-3",
		title: "Optional Chaining",
		description: "Safely access nested object properties",
		language: "JavaScript",
		category: "Objects",
		code: `// Instead of this:
const street = user && user.address && user.address.street;

// Use this:
const street = user?.address?.street;`,
		explanation:
			"Optional chaining (?.) allows you to safely access nested properties without throwing an error if any intermediate property is null or undefined.",
		difficulty: "Intermediate",
		tags: ["optional-chaining", "null-safety", "es2020"],
	},
	{
		id: "js-4",
		title: "Template Literals for Dynamic Strings",
		description: "Create dynamic strings with embedded expressions",
		language: "JavaScript",
		category: "Strings",
		code: `// Instead of this:
const message = 'Hello ' + name + ', you are ' + age + ' years old';

// Use this:
const message = \`Hello \${name}, you are \${age} years old\`;`,
		explanation:
			"Template literals (backticks) allow you to embed expressions and create multi-line strings more easily than string concatenation.",
		difficulty: "Beginner",
		tags: ["template-literals", "strings", "es6"],
	},

	// Python Tricks
	{
		id: "py-1",
		title: "List Comprehensions",
		description: "Create lists in a concise, readable way",
		language: "Python",
		category: "Lists",
		code: `# Instead of this:
squares = []
for i in range(10):
    squares.append(i ** 2)

# Use this:
squares = [i ** 2 for i in range(10)]`,
		explanation:
			"List comprehensions provide a concise way to create lists based on existing sequences or iterables.",
		difficulty: "Beginner",
		tags: ["list-comprehension", "functional-programming"],
	},
	{
		id: "py-2",
		title: "Dictionary Comprehensions",
		description: "Create dictionaries efficiently",
		language: "Python",
		category: "Dictionaries",
		code: `# Instead of this:
word_lengths = {}
for word in words:
    word_lengths[word] = len(word)

# Use this:
word_lengths = {word: len(word) for word in words}`,
		explanation:
			"Dictionary comprehensions allow you to create dictionaries in a single, readable expression.",
		difficulty: "Intermediate",
		tags: ["dictionary-comprehension", "functional-programming"],
	},
	{
		id: "py-3",
		title: "Unpacking with *args and **kwargs",
		description: "Flexible function arguments",
		language: "Python",
		category: "Functions",
		code: `def flexible_function(*args, **kwargs):
    print(f"Positional arguments: {args}")
    print(f"Keyword arguments: {kwargs}")

# Usage
flexible_function(1, 2, 3, name="John", age=30)`,
		explanation:
			"*args collects positional arguments into a tuple, while **kwargs collects keyword arguments into a dictionary.",
		difficulty: "Intermediate",
		tags: ["args", "kwargs", "functions"],
	},

	// TypeScript Tricks
	{
		id: "ts-1",
		title: "Type Guards",
		description: "Narrow down types safely",
		language: "TypeScript",
		category: "Types",
		code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  }
}`,
		explanation:
			"Type guards are functions that help TypeScript understand the type of a value at runtime.",
		difficulty: "Intermediate",
		tags: ["type-guards", "type-safety", "runtime-checking"],
	},
	{
		id: "ts-2",
		title: "Utility Types",
		description: "Transform existing types",
		language: "TypeScript",
		category: "Types",
		code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Pick only specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit specific properties
type PublicUser = Omit<User, 'password'>;`,
		explanation:
			"Utility types allow you to transform existing types to create new ones without modifying the original.",
		difficulty: "Advanced",
		tags: ["utility-types", "type-transformation"],
	},
];

export default function LanguagesPage() {
	const [tricks, _setTricks] = useState<LanguageTrick[]>(languageTricks);
	const [selectedTrick, setSelectedTrick] = useState<LanguageTrick | null>(
		null,
	);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			router.push("/auth/login");
		}
	};

	const filteredTricks = tricks.filter((trick) => {
		const languageMatch =
			selectedLanguage === "all" || trick.language === selectedLanguage;
		const categoryMatch =
			selectedCategory === "all" || trick.category === selectedCategory;
		const difficultyMatch =
			selectedDifficulty === "all" || trick.difficulty === selectedDifficulty;
		const searchMatch =
			trick.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			trick.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			trick.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			);

		return languageMatch && categoryMatch && difficultyMatch && searchMatch;
	});

	const languages = [...new Set(tricks.map((trick) => trick.language))];
	const categories = [...new Set(tricks.map((trick) => trick.category))];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900">Language Tricks</h1>
					<p className="mt-2 text-gray-600">
						Discover useful coding tricks and tips for different programming
						languages
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Filters and Trick List */}
					<div className="lg:col-span-1">
						<div className="bg-white shadow rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Tricks
								</h3>

								{/* Search */}
								<div className="mb-4">
									<input
										type="text"
										placeholder="Search tricks..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
									/>
								</div>

								{/* Filters */}
								<div className="mb-4 space-y-2">
									<select
										value={selectedLanguage}
										onChange={(e) => setSelectedLanguage(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Languages</option>
										{languages.map((lang) => (
											<option key={lang} value={lang}>
												{lang}
											</option>
										))}
									</select>

									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Categories</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>

									<select
										value={selectedDifficulty}
										onChange={(e) => setSelectedDifficulty(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Difficulties</option>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</select>
								</div>

								{/* Trick List */}
								<div className="space-y-2 max-h-96 overflow-y-auto">
									{filteredTricks.map((trick) => (
										<button
											key={trick.id}
											onClick={() => setSelectedTrick(trick)}
											className={`w-full text-left p-3 rounded-lg border transition-colors ${
												selectedTrick?.id === trick.id
													? "border-indigo-500 bg-indigo-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="font-medium text-gray-900">
												{trick.title}
											</div>
											<div className="text-sm text-gray-500 mt-1">
												{trick.description}
											</div>
											<div className="flex items-center space-x-2 mt-2">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{trick.language}
												</span>
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														trick.difficulty === "Beginner"
															? "bg-green-100 text-green-800"
															: trick.difficulty === "Intermediate"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{trick.difficulty}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Trick Details */}
					<div className="lg:col-span-2">
						{selectedTrick ? (
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<div className="mb-6">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-semibold text-gray-900">
												{selectedTrick.title}
											</h2>
											<div className="flex items-center space-x-2">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{selectedTrick.language}
												</span>
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														selectedTrick.difficulty === "Beginner"
															? "bg-green-100 text-green-800"
															: selectedTrick.difficulty === "Intermediate"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{selectedTrick.difficulty}
												</span>
											</div>
										</div>
										<p className="text-gray-600 mt-2">
											{selectedTrick.description}
										</p>
									</div>

									{/* Code Example */}
									<div className="mb-6">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Code Example
										</h3>
										<pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
											<code>{selectedTrick.code}</code>
										</pre>
									</div>

									{/* Explanation */}
									<div className="mb-6">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Explanation
										</h3>
										<p className="text-gray-700 leading-relaxed">
											{selectedTrick.explanation}
										</p>
									</div>

									{/* Tags */}
									<div>
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Tags
										</h3>
										<div className="flex flex-wrap gap-2">
											{selectedTrick.tags.map((tag, index) => (
												<span
													key={index}
													className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<h3 className="mt-2 text-sm font-medium text-gray-900">
										Select a Trick
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Choose a trick from the list to learn more about it.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
