import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /workspace route
    if (pathname.startsWith('/workspace')) {
        const hasCookie = req.cookies.has('alpha_access_token');

        if (hasCookie) {
            return NextResponse.next();
        }

        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/workspace/:path*',
};
