import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, password } = body;

        const validUser = process.env.ALPHA_AUTH_USER || "admin";
        const validPass = process.env.ALPHA_AUTH_PASSWORD || "biotech";

        if (user === validUser && password === validPass) {
            const response = NextResponse.json({ success: true });

            // Set cookie
            // In a real app, use a proper session token / JWT. 
            // For this alpha, a simple opaque token works.
            const cookieStore = await cookies();
            cookieStore.set("alpha_access_token", "valid_session", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
