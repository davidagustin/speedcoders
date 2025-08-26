"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
	children: React.ReactNode;
	session: Session | null;
}

export function NextAuthProvider({ children, session }: NextAuthProviderProps) {
	return <SessionProvider session={session}>{children}</SessionProvider>;
}
