// Application configuration

export const APP_CONFIG = {
	name: "SpeedCoders",
	description: "Master coding skills with interactive LeetCode practice",
	version: "2.0.0",

	// Quiz settings
	quiz: {
		defaultProblemCount: 10,
		minProblems: 1,
		maxProblems: 25,
		defaultTimeLimit: 15, // minutes
		timeLimits: [3, 5, 10, 15, 20, 30],
	},

	// Learning paths
	learning: {
		problemsPerPath: 10,
		difficultyProgression: {
			Beginner: ["Easy"],
			Intermediate: ["Easy", "Medium"],
			Advanced: ["Medium", "Hard"],
		},
	},

	// Caching
	cache: {
		ttl: {
			problems: 3600, // 1 hour
			quiz: 1800, // 30 minutes
			userProgress: 300, // 5 minutes
		},
	},

	// API settings
	api: {
		rateLimit: {
			requests: 100,
			window: 60, // seconds
		},
		timeout: 30000, // 30 seconds
	},

	// UI settings
	ui: {
		itemsPerPage: 20,
		maxSearchResults: 50,
		animationDuration: 200,
	},
};

// Feature flags
export const FEATURES = {
	enableEditorial: true,
	enableCodeExecution: false, // Coming soon
	enableLeaderboard: true,
	enableAchievements: false, // Coming soon
	enableSocialSharing: false, // Coming soon
	enableOfflineMode: false, // Coming soon
};

// External URLs
export const EXTERNAL_URLS = {
	leetcode: "https://leetcode.com/problems/",
	github: "https://github.com/speedcoders",
	documentation: "https://docs.speedcoders.com",
	support: "https://support.speedcoders.com",
};
