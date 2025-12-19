import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /workspace route
    if (pathname.startsWith('/workspace')) {
        const token = req.cookies.get('alpha_access_token')?.value;

        if (token) {
            try {
                const secretKey = new TextEncoder().encode(
                    process.env.ALPHA_AUTH_SECRET || ""
                );
                await jwtVerify(token, secretKey);
                return NextResponse.next();
            } catch (err) {
                // Token invalid or expired
                console.error("JWT Verification failed:", err);
            }
        }

        // Redirect to login page if no token or invalid
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('returnUrl', pathname);

        // Delete invalid cookie if it exists
        const response = NextResponse.redirect(loginUrl);
        if (token) {
            response.cookies.delete('alpha_access_token');
        }
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/workspace/:path*',
};
