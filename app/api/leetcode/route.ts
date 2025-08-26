import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis =
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
		? Redis.fromEnv()
		: null;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const slug = searchParams.get("slug");

	if (!slug) {
		return NextResponse.json({ error: "Slug is required" }, { status: 400 });
	}

	try {
		// Check Redis cache first
		if (redis) {
			const cached = await redis.get(`leetcode:${slug}`);
			if (cached) {
				return NextResponse.json(cached);
			}
		}

		// Fetch from LeetCode editorial
		const editorialUrl = `https://leetcode.com/problems/${slug}/editorial/`;
		const response = await fetch(editorialUrl, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch problem");
		}

		const html = await response.text();

		// Parse the HTML to extract problem details and approaches
		const problemData = {
			slug,
			editorialUrl,
			approaches: extractApproaches(html),
			complexity: extractComplexity(html),
			fetchedAt: new Date().toISOString(),
		};

		// Cache in Redis for 24 hours
		if (redis) {
			await redis.setex(`leetcode:${slug}`, 86400, problemData);
		}

		return NextResponse.json(problemData);
	} catch (error) {
		console.error("Error fetching LeetCode problem:", error);
		return NextResponse.json(
			{ error: "Failed to fetch problem data" },
			{ status: 500 },
		);
	}
}

function extractApproaches(html: string): string[] {
	// Basic extraction of approach names from editorial
	const approaches: string[] = [];
	const approachRegex = /Approach\s+\d+:\s+([^<]+)/gi;
	let match;

	while ((match = approachRegex.exec(html)) !== null) {
		approaches.push(match[1].trim());
	}

	// If no approaches found, return common patterns
	if (approaches.length === 0) {
		if (html.includes("hash") || html.includes("Hash")) {
			approaches.push("Hash Map");
		}
		if (html.includes("two pointer") || html.includes("Two Pointer")) {
			approaches.push("Two Pointers");
		}
		if (
			html.includes("dynamic programming") ||
			html.includes("Dynamic Programming")
		) {
			approaches.push("Dynamic Programming");
		}
		if (html.includes("sliding window") || html.includes("Sliding Window")) {
			approaches.push("Sliding Window");
		}
	}

	return approaches;
}

function extractComplexity(html: string): { time: string; space: string } {
	const timeRegex = /Time\s+Complexity[:\s]+O\([^)]+\)/i;
	const spaceRegex = /Space\s+Complexity[:\s]+O\([^)]+\)/i;

	const timeMatch = html.match(timeRegex);
	const spaceMatch = html.match(spaceRegex);

	return {
		time: timeMatch ? timeMatch[0] : "Unknown",
		space: spaceMatch ? spaceMatch[0] : "Unknown",
	};
}
