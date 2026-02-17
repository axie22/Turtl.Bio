import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, password } = body;

    const authUser = process.env.ALPHA_AUTH_USER;
    const authPass = process.env.ALPHA_AUTH_PASSWORD;
    const authSecret = process.env.ALPHA_AUTH_SECRET;

    if (!authSecret) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (user === authUser && password === authPass) {
      const secret = new TextEncoder().encode(authSecret);
      const token = await new SignJWT({
        user,
        role: 'alpha_user',
        iss: 'turtl-backend',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);

      const response = NextResponse.json({
        success: true,
        token,
      });

      response.cookies.set('alpha_access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
}

