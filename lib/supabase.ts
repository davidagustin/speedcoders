import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			problems: {
				Row: {
					id: string;
					title: string;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					description: string;
					examples: any;
					constraints: any;
					solutions: string[];
					leetcode_url: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					description: string;
					examples: any;
					constraints: any;
					solutions: string[];
					leetcode_url: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					difficulty?: "Easy" | "Medium" | "Hard";
					category?: string;
					description?: string;
					examples?: any;
					constraints?: any;
					solutions?: string[];
					leetcode_url?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			algorithms: {
				Row: {
					id: string;
					name: string;
					category: string;
					description: string;
					time_complexity: string;
					space_complexity: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					category: string;
					description: string;
					time_complexity: string;
					space_complexity: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					name?: string;
					category?: string;
					description?: string;
					time_complexity?: string;
					space_complexity?: string;
					created_at?: string;
				};
			};
			quizzes: {
				Row: {
					id: string;
					title: string;
					description: string;
					time_limit: number;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					created_by: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					description: string;
					time_limit: number;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					created_by: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string;
					time_limit?: number;
					difficulty?: "Easy" | "Medium" | "Hard";
					category?: string;
					created_by?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			quiz_questions: {
				Row: {
					id: string;
					quiz_id: string;
					problem_id: string;
					algorithm_id: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					quiz_id: string;
					problem_id: string;
					algorithm_id?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					quiz_id?: string;
					problem_id?: string;
					algorithm_id?: string | null;
					created_at?: string;
				};
			};
			quiz_attempts: {
				Row: {
					id: string;
					quiz_id: string;
					user_id: string;
					score: number;
					total_questions: number;
					time_taken: number;
					completed_at: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					quiz_id: string;
					user_id: string;
					score: number;
					total_questions: number;
					time_taken: number;
					completed_at?: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					quiz_id?: string;
					user_id?: string;
					score?: number;
					total_questions?: number;
					time_taken?: number;
					completed_at?: string;
					created_at?: string;
				};
			};
			quiz_answers: {
				Row: {
					id: string;
					attempt_id: string;
					question_id: string;
					selected_algorithm: string;
					is_correct: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					attempt_id: string;
					question_id: string;
					selected_algorithm: string;
					is_correct: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					attempt_id?: string;
					question_id?: string;
					selected_algorithm?: string;
					is_correct?: boolean;
					created_at?: string;
				};
			};
			regex_exercises: {
				Row: {
					id: string;
					title: string;
					description: string;
					pattern: string;
					test_cases: any;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					hints: string[];
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					description: string;
					pattern: string;
					test_cases: any;
					difficulty: "Easy" | "Medium" | "Hard";
					category: string;
					hints: string[];
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string;
					pattern?: string;
					test_cases?: any;
					difficulty?: "Easy" | "Medium" | "Hard";
					category?: string;
					hints?: string[];
					created_at?: string;
				};
			};
			language_tricks: {
				Row: {
					id: string;
					title: string;
					language: string;
					description: string;
					code_example: string;
					explanation: string;
					difficulty: "Easy" | "Medium" | "Hard";
					tags: string[];
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					language: string;
					description: string;
					code_example: string;
					explanation: string;
					difficulty: "Easy" | "Medium" | "Hard";
					tags: string[];
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					language?: string;
					description?: string;
					code_example?: string;
					explanation?: string;
					difficulty?: "Easy" | "Medium" | "Hard";
					tags?: string[];
					created_at?: string;
				};
			};
			frontend_tricks: {
				Row: {
					id: string;
					title: string;
					technology: string;
					description: string;
					code_example: string;
					explanation: string;
					difficulty: "Easy" | "Medium" | "Hard";
					tags: string[];
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					technology: string;
					description: string;
					code_example: string;
					explanation: string;
					difficulty: "Easy" | "Medium" | "Hard";
					tags: string[];
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					technology?: string;
					description?: string;
					code_example?: string;
					explanation?: string;
					difficulty?: "Easy" | "Medium" | "Hard";
					tags?: string[];
					created_at?: string;
				};
			};
		};
	};
};
