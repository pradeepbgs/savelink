import { verifyToken } from "@/lib/authJWT";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    try {

        const response = NextResponse.json(
            {
                message:"Logged out successfully",
                success:true
            }
        )

        response.cookies.set('token','',{
            httpOnly:true,
            expires:new Date(0),
            path:'/',
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax'
        })

        return response;

    } catch (error:any) {

        return NextResponse.json({error: error.message}, {status:500})

    }
}