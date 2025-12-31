import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json(
                { success: false, message: "Query parameter required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`[SearchProxy] Proxying to: ${backendUrl}/files/search?q=${query}`);
        
        const res = await fetch(`${backendUrl}/files/search?q=${encodeURIComponent(query)}`);
        console.log(`[SearchProxy] Backend status: ${res.status}`);

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Backend error" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
