import { verifyToken } from "@/lib/authJWT";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const token = await verifyToken(request)
    if (!token) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    
    const response = NextResponse.json({success:true, message: "Logged out successfully" }, { status: 200 });
    
    response.cookies.set({
        name: 'token', 
        value: '',
        expires: new Date(0),
        path: '/',
    });
    
    return response;
}