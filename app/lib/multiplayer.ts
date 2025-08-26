import { algorithmValidator } from "./algorithm-validator";
import { codeExecutor } from "./code-execution";
import { editorialProblems } from "./editorial-problems";

export interface MultiplayerRoom {
	id: string;
	name: string;
	host: Player;
	players: Player[];
	maxPlayers: number;
	status: "waiting" | "countdown" | "active" | "finished";
	settings: GameSettings;
	currentProblem?: Problem;
	startTime?: Date;
	endTime?: Date;
	leaderboard: LeaderboardEntry[];
}

export interface Player {
	id: string;
	username: string;
	avatar?: string;
	rating: number;
	isOnline: boolean;
	currentStatus: "idle" | "coding" | "submitting" | "finished";
}

export interface GameSettings {
	timeLimit: number; // in seconds
	problemCount: number;
	difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
	categories: string[];
	allowHints: boolean;
	allowViewSolutions: boolean;
	scoringMode: "speed" | "accuracy" | "balanced";
}

export interface Problem {
	id: string;
	title: string;
	difficulty: string;
	category: string;
	description: string;
	examples: any[];
	testCases: TestCase[];
	timeLimit: number;
	correctAlgorithms: string[];
}

export interface TestCase {
	input: string;
	expectedOutput: string;
	isHidden: boolean;
}

export interface LeaderboardEntry {
	playerId: string;
	username: string;
	score: number;
	solvedCount: number;
	totalTime: number;
	submissions: Submission[];
	rank: number;
}

export interface Submission {
	problemId: string;
	code: string;
	language: string;
	submitTime: Date;
	score: number;
	passed: boolean;
	executionTime: number;
	algorithmCorrect: boolean;
}

export interface RoomEvent {
	type:
		| "player_joined"
		| "player_left"
		| "game_started"
		| "problem_changed"
		| "submission_received"
		| "leaderboard_updated"
		| "game_finished";
	data: any;
	timestamp: Date;
}

export class MultiplayerManager {
	private rooms: Map<string, MultiplayerRoom> = new Map();
	private playerRooms: Map<string, string> = new Map();
	private eventListeners: Map<string, ((event: RoomEvent) => void)[]> =
		new Map();

	createRoom(host: Player, settings: GameSettings): MultiplayerRoom {
		const roomId = this.generateRoomId();
		const room: MultiplayerRoom = {
			id: roomId,
			name: `${host.username}'s Room`,
			host,
			players: [host],
			maxPlayers: 10,
			status: "waiting",
			settings,
			leaderboard: [],
		};

		this.rooms.set(roomId, room);
		this.playerRooms.set(host.id, roomId);

		return room;
	}

	joinRoom(roomId: string, player: Player): boolean {
		const room = this.rooms.get(roomId);
		if (
			!room ||
			room.players.length >= room.maxPlayers ||
			room.status !== "waiting"
		) {
			return false;
		}

		room.players.push(player);
		this.playerRooms.set(player.id, roomId);

		this.emitRoomEvent(roomId, {
			type: "player_joined",
			data: { player },
			timestamp: new Date(),
		});

		return true;
	}

	leaveRoom(playerId: string): boolean {
		const roomId = this.playerRooms.get(playerId);
		if (!roomId) return false;

		const room = this.rooms.get(roomId);
		if (!room) return false;

		room.players = room.players.filter((p) => p.id !== playerId);
		this.playerRooms.delete(playerId);

		// If host left, assign new host or delete room
		if (room.host.id === playerId) {
			if (room.players.length > 0) {
				room.host = room.players[0];
			} else {
				this.rooms.delete(roomId);
				return true;
			}
		}

		this.emitRoomEvent(roomId, {
			type: "player_left",
			data: { playerId },
			timestamp: new Date(),
		});

		return true;
	}

	startGame(roomId: string, hostId: string): boolean {
		const room = this.rooms.get(roomId);
		if (!room || room.host.id !== hostId || room.status !== "waiting") {
			return false;
		}

		room.status = "countdown";
		room.startTime = new Date();

		// Select problems based on settings
		const problems = this.selectProblems(room.settings);
		room.currentProblem = problems[0];

		// Initialize leaderboard
		room.leaderboard = room.players.map((player) => ({
			playerId: player.id,
			username: player.username,
			score: 0,
			solvedCount: 0,
			totalTime: 0,
			submissions: [],
			rank: 1,
		}));

		// Start countdown (3 seconds)
		setTimeout(() => {
			room.status = "active";
			this.emitRoomEvent(roomId, {
				type: "game_started",
				data: { problem: room.currentProblem, players: room.players },
				timestamp: new Date(),
			});
		}, 3000);

		return true;
	}

	async submitSolution(
		roomId: string,
		playerId: string,
		code: string,
		language: string,
	): Promise<Submission | null> {
		const room = this.rooms.get(roomId);
		if (!room || !room.currentProblem || room.status !== "active") {
			return null;
		}

		const startTime = Date.now();
		const problem = room.currentProblem;

		// Execute code against test cases
		const executionResult = await codeExecutor.executeCode({
			code,
			language: language as any,
			testCases: problem.testCases.map((tc) => ({
				input: tc.input,
				expectedOutput: tc.expectedOutput,
			})),
		});

		// Validate algorithm approach
		const validationResult = algorithmValidator.validateAlgorithm(
			code,
			problem.correctAlgorithms,
		);

		// Calculate score
		const score = this.calculateScore(
			executionResult.success,
			validationResult.isCorrect,
			Date.now() - startTime,
			room.settings.scoringMode,
		);

		const submission: Submission = {
			problemId: problem.id,
			code,
			language,
			submitTime: new Date(),
			score,
			passed: executionResult.success,
			executionTime: executionResult.executionTime,
			algorithmCorrect: validationResult.isCorrect,
		};

		// Update leaderboard
		const entry = room.leaderboard.find((e) => e.playerId === playerId);
		if (entry) {
			entry.submissions.push(submission);
			entry.score += score;
			if (submission.passed) {
				entry.solvedCount++;
			}
			entry.totalTime += submission.executionTime;
		}

		// Sort leaderboard by score
		room.leaderboard.sort((a, b) => b.score - a.score);
		room.leaderboard.forEach((entry, index) => {
			entry.rank = index + 1;
		});

		this.emitRoomEvent(roomId, {
			type: "submission_received",
			data: { submission, playerId },
			timestamp: new Date(),
		});

		this.emitRoomEvent(roomId, {
			type: "leaderboard_updated",
			data: { leaderboard: room.leaderboard },
			timestamp: new Date(),
		});

		return submission;
	}

	private selectProblems(settings: GameSettings): Problem[] {
		let candidates = editorialProblems;

		// Filter by difficulty
		if (settings.difficulty !== "Mixed") {
			candidates = candidates.filter(
				(p) => p.difficulty === settings.difficulty,
			);
		}

		// Filter by categories
		if (settings.categories.length > 0) {
			candidates = candidates.filter((p) =>
				settings.categories.includes(p.category),
			);
		}

		// Randomly select problems
		const shuffled = candidates.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, settings.problemCount).map((p) => ({
			id: p.title,
			title: p.title,
			difficulty: p.difficulty,
			category: p.category,
			description: p.description,
			examples: p.examples,
			testCases: this.generateTestCases(p),
			timeLimit: settings.timeLimit,
			correctAlgorithms: p.solutions?.[0]?.name
				? [p.solutions[0].name]
				: ["Array"],
		}));
	}

	private generateTestCases(problem: any): TestCase[] {
		const testCases: TestCase[] = [];

		// Add example cases
		problem.examples?.forEach((example: any, _index: number) => {
			testCases.push({
				input: example.input,
				expectedOutput: example.output,
				isHidden: false,
			});
		});

		// Add some hidden test cases (mocked for now)
		testCases.push(
			{
				input: "Edge case input",
				expectedOutput: "Edge case output",
				isHidden: true,
			},
			{
				input: "Large input",
				expectedOutput: "Large output",
				isHidden: true,
			},
		);

		return testCases;
	}

	private calculateScore(
		passed: boolean,
		algorithmCorrect: boolean,
		executionTime: number,
		scoringMode: string,
	): number {
		if (!passed) return 0;

		let baseScore = 100;

		// Algorithm bonus
		if (algorithmCorrect) {
			baseScore += 50;
		}

		// Time bonus based on scoring mode
		switch (scoringMode) {
			case "speed":
				baseScore += Math.max(0, 100 - Math.floor(executionTime / 1000) * 10);
				break;
			case "accuracy":
				// Accuracy mode doesn't penalize time as much
				baseScore += Math.max(0, 50 - Math.floor(executionTime / 1000) * 2);
				break;
			case "balanced":
				baseScore += Math.max(0, 75 - Math.floor(executionTime / 1000) * 5);
				break;
		}

		return Math.max(0, baseScore);
	}

	private generateRoomId(): string {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	}

	private emitRoomEvent(roomId: string, event: RoomEvent): void {
		const listeners = this.eventListeners.get(roomId) || [];
		listeners.forEach((listener) => listener(event));
	}

	// Event management
	addEventListener(roomId: string, listener: (event: RoomEvent) => void): void {
		if (!this.eventListeners.has(roomId)) {
			this.eventListeners.set(roomId, []);
		}
		this.eventListeners.get(roomId)?.push(listener);
	}

	removeEventListener(
		roomId: string,
		listener: (event: RoomEvent) => void,
	): void {
		const listeners = this.eventListeners.get(roomId) || [];
		const index = listeners.indexOf(listener);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	}

	// Getters
	getRoom(roomId: string): MultiplayerRoom | undefined {
		return this.rooms.get(roomId);
	}

	getPlayerRoom(playerId: string): MultiplayerRoom | undefined {
		const roomId = this.playerRooms.get(playerId);
		return roomId ? this.rooms.get(roomId) : undefined;
	}

	getAllRooms(): MultiplayerRoom[] {
		return Array.from(this.rooms.values()).filter(
			(room) => room.status === "waiting",
		);
	}

	// Rating system
	updatePlayerRatings(roomId: string): void {
		const room = this.rooms.get(roomId);
		if (!room || room.status !== "finished") return;

		const sortedPlayers = [...room.leaderboard].sort((a, b) => a.rank - b.rank);

		// ELO-style rating updates
		sortedPlayers.forEach((entry, index) => {
			const player = room.players.find((p) => p.id === entry.playerId);
			if (!player) return;

			const expectedRank = this.calculateExpectedRank(
				player.rating,
				room.players,
			);
			const actualRank = index + 1;
			const rankDifference = expectedRank - actualRank;

			// Update rating (simplified ELO)
			const ratingChange = Math.floor(rankDifference * 10);
			player.rating = Math.max(0, player.rating + ratingChange);
		});
	}

	private calculateExpectedRank(
		playerRating: number,
		allPlayers: Player[],
	): number {
		const sortedByRating = [...allPlayers].sort((a, b) => b.rating - a.rating);
		return sortedByRating.findIndex((p) => p.rating <= playerRating) + 1;
	}
}

export const multiplayerManager = new MultiplayerManager();
