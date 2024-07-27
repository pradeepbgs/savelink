import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token =  request.cookies.get('token')?.value ?? "";
  console.log(token);
  if (!token) {
    return NextResponse.json({ isAuthenticated: false, success:false });
  }

  try {
    verify(token, process.env.JWT_TOKEN_SECRET!);
    return NextResponse.json({ isAuthenticated: true, success:true });
  } catch (error) {
   return NextResponse.json({ isAuthenticated: false, success:false });
  }
}