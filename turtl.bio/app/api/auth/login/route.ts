import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, password } = body;

        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, password }),
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: res.status }
            );
        }

        const data = await res.json();

        if (data.success && data.token) {
            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set("alpha_access_token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return NextResponse.json({ success: true });
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
