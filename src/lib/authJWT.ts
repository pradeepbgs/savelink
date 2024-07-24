import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function authjwt(request: NextRequest): Promise<jwt.JwtPayload | null> {
    try {
        const token = request.cookies.get('token')?.value ?? "";
        const secret = process.env.JWT_TOKEN_SECRET;

        if (!secret) {
            throw new Error("JWT_TOKEN_SECRET is not defined");
        }

        const decodedToken = jwt.verify(token, secret) as jwt.JwtPayload;
        return decodedToken;
    } catch (error: any) {
        console.error("JWT verification error:", error.message);
        return null;
    }
}
