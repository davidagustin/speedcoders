const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

class LeetCodeGraphQLScraper {
	constructor() {
		this.baseUrl = "https://leetcode.com/graphql";
		this.outputDir = path.join(__dirname, "../data");
		this.session = axios.create({
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
	}

	async initialize() {
		console.log("🚀 Initializing LeetCode GraphQL Scraper...");

		try {
			await fs.mkdir(this.outputDir, { recursive: true });
			console.log("✅ Output directory ready");
		} catch (error) {
			console.log("Output directory already exists");
		}
	}

	async getProblemList() {
		console.log("📋 Fetching problem list via GraphQL...");

		const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
            ) {
                total: totalNum
                questions: data {
                    acRate
                    difficulty
                    freqBar
                    frontendQuestionId: questionFrontendId
                    isFavor
                    paidOnly: isPaidOnly
                    status
                    title
                    titleSlug
                    topicTags {
                        name
                        id
                        slug
                    }
                    hasSolution
                    hasVideoSolution
                }
            }
        }`;

		try {
			const response = await this.session.post(this.baseUrl, {
				query,
				variables: {
					categorySlug: "",
					limit: 3000, // Get all problems
					skip: 0,
					filters: {},
				},
			});

			if (
				response.data &&
				response.data.data &&
				response.data.data.problemsetQuestionList
			) {
				const problems = response.data.data.problemsetQuestionList.questions;
				console.log(`Found ${problems.length} problems`);
				return problems;
			} else {
				console.error("Invalid response format:", response.data);
				return [];
			}
		} catch (error) {
			console.error("Error fetching problem list:", error.message);
			return [];
		}
	}

	async getProblemDetails(titleSlug) {
		const query = `
        query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                questionId
                questionFrontendId
                boundTopicId
                title
                titleSlug
                content
                translatedTitle
                translatedContent
                isPaidOnly
                difficulty
                likes
                dislikes
                isLiked
                similarQuestions
                contributors {
                    username
                    profileUrl
                    avatarUrl
                    __typename
                }
                langToValidPlayground
                topicTags {
                    id
                    name
                    slug
                    translatedName
                    __typename
                }
                companyTagStats
                codeSnippets {
                    lang
                    langSlug
                    code
                    __typename
                }
                stats
                hints
                solution {
                    id
                    canSeeDetail
                    paidOnly
                    hasVideoSolution
                    paidOnlyVideo
                    __typename
                }
                status
                sampleTestCase
                metaData
                judgerAvailable
                judgeType
                mysqlSchemas
                enableRunCode
                enableTestMode
                enableDebugger
                envInfo
                libraryUrl
                adminUrl
                challengeQuestion {
                    id
                    date
                    incompleteChallengeCount
                    streakCount
                    type
                    __typename
                }
                __typename
            }
        }`;

		try {
			const response = await this.session.post(this.baseUrl, {
				query,
				variables: { titleSlug },
			});

			if (response.data && response.data.data && response.data.data.question) {
				return response.data.data.question;
			} else {
				console.error(`Invalid response for ${titleSlug}:`, response.data);
				return null;
			}
		} catch (error) {
			console.error(`Error fetching details for ${titleSlug}:`, error.message);
			return null;
		}
	}

	async scrapeAllProblems() {
		console.log("🎯 Starting to scrape all problems via GraphQL...");

		const problemList = await this.getProblemList();
		const results = [];
		const failedProblems = [];

		for (let i = 0; i < problemList.length; i++) {
			const problem = problemList[i];
			console.log(
				`Progress: ${i + 1}/${problemList.length} - ${problem.title}`,
			);

			try {
				const problemDetails = await this.getProblemDetails(problem.titleSlug);

				if (problemDetails) {
					const enrichedProblem = {
						...problem,
						...problemDetails,
						scrapedAt: new Date().toISOString(),
					};

					results.push(enrichedProblem);
					await this.saveProblem(enrichedProblem);
				} else {
					failedProblems.push(problem.titleSlug);
				}

				// Rate limiting - be respectful to the API
				await this.delay(500 + Math.random() * 1000);

				// Save progress every 20 problems
				if ((i + 1) % 20 === 0) {
					await this.saveProgress(results, i + 1, problemList.length);
				}
			} catch (error) {
				console.error(`Error processing ${problem.titleSlug}:`, error.message);
				failedProblems.push(problem.titleSlug);
			}
		}

		// Save failed problems
		if (failedProblems.length > 0) {
			await this.saveFailedProblems(failedProblems);
		}

		return results;
	}

	async saveProblem(problemData) {
		try {
			const filename = `problem-${problemData.questionFrontendId}-${problemData.titleSlug}.json`;
			const filepath = path.join(this.outputDir, filename);

			await fs.writeFile(filepath, JSON.stringify(problemData, null, 2));
			console.log(`✅ Saved: ${filename}`);
		} catch (error) {
			console.error("Error saving problem:", error);
		}
	}

	async saveProgress(problems, current, total) {
		try {
			const progressFile = path.join(this.outputDir, "scraping-progress.json");
			await fs.writeFile(
				progressFile,
				JSON.stringify(
					{
						totalScraped: problems.length,
						currentProgress: current,
						totalProblems: total,
						lastUpdated: new Date().toISOString(),
						problems: problems.map((p) => ({
							id: p.questionFrontendId,
							title: p.title,
							titleSlug: p.titleSlug,
							difficulty: p.difficulty,
						})),
					},
					null,
					2,
				),
			);

			console.log(`📊 Progress saved: ${current}/${total} problems scraped`);
		} catch (error) {
			console.error("Error saving progress:", error);
		}
	}

	async saveAllProblems(problems) {
		try {
			const allProblemsFile = path.join(
				this.outputDir,
				"all-leetcode-problems-graphql.json",
			);
			await fs.writeFile(
				allProblemsFile,
				JSON.stringify(
					{
						metadata: {
							totalProblems: problems.length,
							scrapedAt: new Date().toISOString(),
							source: "LeetCode GraphQL API",
							version: "1.0.0",
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

	async saveFailedProblems(failedProblems) {
		try {
			const failedFile = path.join(
				this.outputDir,
				"failed-problems-graphql.json",
			);
			await fs.writeFile(
				failedFile,
				JSON.stringify(
					{
						failedAt: new Date().toISOString(),
						count: failedProblems.length,
						problems: failedProblems,
					},
					null,
					2,
				),
			);
			console.log(
				`❌ Saved ${failedProblems.length} failed problems to ${failedFile}`,
			);
		} catch (error) {
			console.error("Error saving failed problems:", error);
		}
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Main execution function
async function main() {
	const scraper = new LeetCodeGraphQLScraper();

	try {
		await scraper.initialize();

		console.log("🚀 Starting LeetCode problem scraping via GraphQL...");
		const problems = await scraper.scrapeAllProblems();

		await scraper.saveAllProblems(problems);

		console.log(`🎉 Scraping completed! Scraped ${problems.length} problems`);
		console.log(`📁 Check the 'data' directory for the scraped files`);
	} catch (error) {
		console.error("❌ Scraping failed:", error);
	}
}

// Export for use as module
module.exports = { LeetCodeGraphQLScraper };

// Run if called directly
if (require.main === module) {
	main();
}
