import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { vitals, metrics, url, userAgent, timestamp } = body;

		// Using imported supabase client

		// Store performance data
		const { error } = await supabase.from("performance_logs").insert({
			url,
			user_agent: userAgent,
			vitals,
			metrics,
			timestamp: new Date(timestamp).toISOString(),
			session_id: request.headers.get("x-session-id") || "anonymous",
		});

		if (error) {
			console.error("Failed to store performance data:", error);
			return NextResponse.json(
				{ error: "Failed to store metrics" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Performance API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
