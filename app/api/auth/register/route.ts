import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email, password, name } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Mock registration - in production, this would create a real user
		const mockUser = {
			id: "user_" + Date.now(),
			email,
			name: name || email.split("@")[0],
			role: "user",
			createdAt: new Date().toISOString(),
		};

		// Create a simple session token
		const token = Buffer.from(JSON.stringify(mockUser)).toString("base64");

		const response = NextResponse.json({
			user: mockUser,
			token,
			success: true,
			message: "Registration successful",
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
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}