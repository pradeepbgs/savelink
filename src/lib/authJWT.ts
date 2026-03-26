import {jwtVerify} from 'jose';
import { NextRequest } from 'next/server';

export async function verifyToken(request: NextRequest): Promise<any> {
    try {
        const token = request.cookies.get('token')?.value ?? "";
        const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);

        if (!token) {
            console.error("No token found in cookies");
            return null;
        }

        if (!secret) {
            throw new Error("JWT_TOKEN_SECRET is not defined");
        }

        const {payload} = await jwtVerify(token, secret);
        return {payload};
    } catch (error: any) {
        console.error("JWT verification error:", error.message);
        return null;
    }
}
