const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

class LeetCodeScraper {
	constructor() {
		this.browser = null;
		this.page = null;
		this.problems = [];
		this.baseUrl = "https://leetcode.com";
		this.outputDir = path.join(__dirname, "../data");
	}

	async initialize() {
		console.log("🚀 Initializing LeetCode Scraper...");
		this.browser = await puppeteer.launch({
			headless: false, // Set to true for production
			defaultViewport: { width: 1920, height: 1080 },
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		this.page = await this.browser.newPage();

		// Set user agent to avoid detection
		await this.page.setUserAgent(
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		);

		// Create output directory if it doesn't exist
		try {
			await fs.mkdir(this.outputDir, { recursive: true });
		} catch (error) {
			console.log("Output directory already exists");
		}
	}

	async getProblemList() {
		console.log("📋 Fetching problem list...");

		try {
			await this.page.goto(`${this.baseUrl}/problemset/all/`, {
				waitUntil: "networkidle2",
				timeout: 30000,
			});

			// Wait for the problems table to load
			await this.page.waitForSelector('[data-cy="question-title"]', {
				timeout: 10000,
			});

			// Get all problem links
			const problemLinks = await this.page.evaluate(() => {
				const links = Array.from(
					document.querySelectorAll('[data-cy="question-title"]'),
				);
				return links.map((link) => {
					const href = link.getAttribute("href");
					const title = link.textContent.trim();
					return { href, title };
				});
			});

			console.log(`Found ${problemLinks.length} problems`);
			return problemLinks;
		} catch (error) {
			console.error("Error fetching problem list:", error);
			return [];
		}
	}

	async scrapeProblem(problemUrl) {
		try {
			console.log(`🔍 Scraping: ${problemUrl}`);

			await this.page.goto(`${this.baseUrl}${problemUrl}`, {
				waitUntil: "networkidle2",
				timeout: 30000,
			});

			// Wait for the problem content to load
			await this.page.waitForSelector(
				'[data-track-load="description_content"]',
				{ timeout: 10000 },
			);

			// Extract problem details
			const problemData = await this.page.evaluate(() => {
				const titleElement = document.querySelector(
					'[data-cy="question-title"]',
				);
				const difficultyElement = document.querySelector("[diff]");
				const descriptionElement = document.querySelector(
					'[data-track-load="description_content"]',
				);
				const examplesElement = document.querySelector(
					'[data-track-load="description_content"]',
				);

				// Get problem number from URL
				const urlParts = window.location.pathname.split("/");
				const problemNumber = urlParts[2] || "";

				return {
					number: problemNumber,
					title: titleElement ? titleElement.textContent.trim() : "",
					difficulty: difficultyElement
						? difficultyElement.getAttribute("diff")
						: "",
					description: descriptionElement ? descriptionElement.innerHTML : "",
					url: window.location.href,
					scrapedAt: new Date().toISOString(),
				};
			});

			// Add delay to be respectful to the server
			await this.delay(1000 + Math.random() * 2000);

			return problemData;
		} catch (error) {
			console.error(`Error scraping problem ${problemUrl}:`, error);
			return null;
		}
	}

	async scrapeAllProblems() {
		console.log("🎯 Starting to scrape all problems...");

		const problemList = await this.getProblemList();
		const results = [];

		for (let i = 0; i < problemList.length; i++) {
			const problem = problemList[i];
			console.log(
				`Progress: ${i + 1}/${problemList.length} - ${problem.title}`,
			);

			const problemData = await this.scrapeProblem(problem.href);
			if (problemData) {
				results.push(problemData);

				// Save individual problem
				await this.saveProblem(problemData);
			}

			// Save progress every 10 problems
			if ((i + 1) % 10 === 0) {
				await this.saveProgress(results);
			}
		}

		return results;
	}

	async saveProblem(problemData) {
		try {
			const filename = `problem-${problemData.number}-${problemData.title.replace(/[^a-zA-Z0-9]/g, "-")}.json`;
			const filepath = path.join(this.outputDir, filename);

			await fs.writeFile(filepath, JSON.stringify(problemData, null, 2));
			console.log(`✅ Saved: ${filename}`);
		} catch (error) {
			console.error("Error saving problem:", error);
		}
	}

	async saveProgress(problems) {
		try {
			const progressFile = path.join(this.outputDir, "scraping-progress.json");
			await fs.writeFile(
				progressFile,
				JSON.stringify(
					{
						totalScraped: problems.length,
						lastUpdated: new Date().toISOString(),
						problems: problems.map((p) => ({
							number: p.number,
							title: p.title,
							url: p.url,
						})),
					},
					null,
					2,
				),
			);
		} catch (error) {
			console.error("Error saving progress:", error);
		}
	}

	async saveAllProblems(problems) {
		try {
			const allProblemsFile = path.join(
				this.outputDir,
				"all-leetcode-problems.json",
			);
			await fs.writeFile(
				allProblemsFile,
				JSON.stringify(
					{
						metadata: {
							totalProblems: problems.length,
							scrapedAt: new Date().toISOString(),
							source: "LeetCode",
						},
						problems: problems,
					},
					null,
					2,
				),
			);

			console.log(
				`🎉 Successfully saved ${problems.length} problems to ${allProblemsFile}`,
			);
		} catch (error) {
			console.error("Error saving all problems:", error);
		}
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async close() {
		if (this.browser) {
			await this.browser.close();
			console.log("🔒 Browser closed");
		}
	}
}

// Enhanced scraper with rate limiting and error handling
class EnhancedLeetCodeScraper extends LeetCodeScraper {
	constructor() {
		super();
		this.rateLimitDelay = 2000; // 2 seconds between requests
		this.maxRetries = 3;
		this.failedProblems = [];
	}

	async scrapeWithRetry(problemUrl, retries = 0) {
		try {
			return await this.scrapeProblem(problemUrl);
		} catch (error) {
			if (retries < this.maxRetries) {
				console.log(
					`Retrying ${problemUrl} (attempt ${retries + 1}/${this.maxRetries})`,
				);
				await this.delay(this.rateLimitDelay * (retries + 1));
				return this.scrapeWithRetry(problemUrl, retries + 1);
			} else {
				console.error(
					`Failed to scrape ${problemUrl} after ${this.maxRetries} attempts`,
				);
				this.failedProblems.push(problemUrl);
				return null;
			}
		}
	}

	async scrapeAllProblems() {
		console.log("🎯 Starting enhanced scraping with retry logic...");

		const problemList = await this.getProblemList();
		const results = [];

		for (let i = 0; i < problemList.length; i++) {
			const problem = problemList[i];
			console.log(
				`Progress: ${i + 1}/${problemList.length} - ${problem.title}`,
			);

			const problemData = await this.scrapeWithRetry(problem.href);
			if (problemData) {
				results.push(problemData);
				await this.saveProblem(problemData);
			}

			// Rate limiting
			await this.delay(this.rateLimitDelay);

			// Save progress every 10 problems
			if ((i + 1) % 10 === 0) {
				await this.saveProgress(results);
				console.log(
					`📊 Progress saved: ${i + 1}/${problemList.length} problems scraped`,
				);
			}
		}

		// Save failed problems
		if (this.failedProblems.length > 0) {
			await this.saveFailedProblems();
		}

		return results;
	}

	async saveFailedProblems() {
		try {
			const failedFile = path.join(this.outputDir, "failed-problems.json");
			await fs.writeFile(
				failedFile,
				JSON.stringify(
					{
						failedAt: new Date().toISOString(),
						count: this.failedProblems.length,
						problems: this.failedProblems,
					},
					null,
					2,
				),
			);
			console.log(
				`❌ Saved ${this.failedProblems.length} failed problems to ${failedFile}`,
			);
		} catch (error) {
			console.error("Error saving failed problems:", error);
		}
	}
}

// Main execution function
async function main() {
	const scraper = new EnhancedLeetCodeScraper();

	try {
		await scraper.initialize();

		console.log("🚀 Starting LeetCode problem scraping...");
		const problems = await scraper.scrapeAllProblems();

		await scraper.saveAllProblems(problems);

		console.log(`🎉 Scraping completed! Scraped ${problems.length} problems`);
		console.log(`📁 Check the 'data' directory for the scraped files`);
	} catch (error) {
		console.error("❌ Scraping failed:", error);
	} finally {
		await scraper.close();
	}
}

// Export for use as module
module.exports = { LeetCodeScraper, EnhancedLeetCodeScraper };

// Run if called directly
if (require.main === module) {
	main();
}
