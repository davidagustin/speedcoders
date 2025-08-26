import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth/next-auth";

export interface AuthenticatedRequest extends NextRequest {
	user?: {
		id: string;
		email: string;
		name?: string;
	};
}

// Extend the session user type to include id
interface ExtendedUser {
	id: string;
	email: string;
	name?: string;
	image?: string;
}

interface ExtendedSession {
	user: ExtendedUser;
	expires: string;
}

export async function withAuth(
	handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
	return async (request: NextRequest) => {
		try {
			const session = (await getServerSession(
				authOptions,
			)) as ExtendedSession | null;

			if (!session || !session.user) {
				return NextResponse.json(
					{ error: "Unauthorized access" },
					{ status: 401 },
				);
			}

			if (!session.user.id) {
				return NextResponse.json(
					{ error: "Invalid user session" },
					{ status: 403 },
				);
			}

			const authenticatedRequest = request as AuthenticatedRequest;
			authenticatedRequest.user = {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
			};

			return await handler(authenticatedRequest);
		} catch (error) {
			console.error("Authentication error:", error);
			return NextResponse.json(
				{ error: "Authentication failed" },
				{ status: 500 },
			);
		}
	};
}

export async function withOptionalAuth(
	handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
	return async (request: NextRequest) => {
		try {
			const session = (await getServerSession(
				authOptions,
			)) as ExtendedSession | null;

			const authenticatedRequest = request as AuthenticatedRequest;
			if (session?.user?.id) {
				authenticatedRequest.user = {
					id: session.user.id,
					email: session.user.email,
					name: session.user.name,
				};
			}

			return await handler(authenticatedRequest);
		} catch (error) {
			console.error("Authentication error:", error);
			return NextResponse.json(
				{ error: "Authentication failed" },
				{ status: 500 },
			);
		}
	};
}

export function validateInput<T>(
	data: any,
	schema: any,
): { success: true; data: T } | { success: false; error: string } {
	try {
		const validated = schema.parse(data);
		return { success: true, data: validated };
	} catch (error: any) {
		return {
			success: false,
			error:
				error.errors?.map((e: any) => e.message).join(", ") || "Invalid input",
		};
	}
}
