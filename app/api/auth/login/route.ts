import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Mock authentication - accept any email/password for demo
		// In production, this would verify against a real database
		const mockUser = {
			id: "user_" + Date.now(),
			email,
			name: email.split("@")[0],
			role: "user",
		};

		// Create a simple session token
		const token = Buffer.from(JSON.stringify(mockUser)).toString("base64");

		const response = NextResponse.json({
			user: mockUser,
			token,
			success: true,
		});

		// Set cookie for session
		response.cookies.set("session-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}