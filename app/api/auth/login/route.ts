import { type NextRequest, NextResponse } from "next/server";
import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user || !user.password) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// Verify password
		const isValidPassword = await verifyPassword(password, user.password);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// Generate JWT token
		const token = generateToken(user.id);

		// Return user data (without password) and token
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
