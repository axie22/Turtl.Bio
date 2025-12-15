import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, password } = body;

        const validUser = process.env.ALPHA_AUTH_USER || "admin";
        const validPass = process.env.ALPHA_AUTH_PASSWORD || "biotech";
        const secretKey = new TextEncoder().encode(
            process.env.ALPHA_AUTH_SECRET || "default_alpha_secret_key_change_in_prod"
        );

        if (user === validUser && password === validPass) {
            // Create response
            const response = NextResponse.json({ success: true });

            // Sign JWT
            const token = await new SignJWT({ user: validUser, role: "alpha_user" })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("7d")
                .sign(secretKey);

            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set("alpha_access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24,
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
