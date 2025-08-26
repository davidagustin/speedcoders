import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.redirect(
		new URL(
			"/auth/login",
			process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
		),
	);
}
