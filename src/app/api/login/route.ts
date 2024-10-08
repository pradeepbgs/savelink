import { dbConnection } from "@/lib/dbconnect";
import { userModel } from "@/models/user.model";
import { signinSchema } from "@/schema/signinSchema";
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(request:NextRequest) {
    await dbConnection();
    try {
        const body = await request.json()
        if (!body) {
            return NextResponse.json({
                success: false,
                message: "Request body is empty"
            }, { status: 400 });
        }
        
        const parsedResult = signinSchema.parse(body);

        const user = await userModel.findOne({
            $or:[
                {email:parsedResult.identifier},
                {username:parsedResult.identifier}
            ]
        })

        if (!user){
            return NextResponse.json({
                success:false,
                message:"couldn't find  user"
            },{status:400})
        }

        const isPasswordValid = await bcrypt.compare(String(parsedResult.password),String(user.password))

        if (!isPasswordValid) {
            return NextResponse.json({
                message:"Invalid password"
            },{status:401})
        }

        const tokendata = {
            _id: user._id,
            username: user.username,
            email: user.email
         }

         const token = await jwt
         .sign(tokendata,process.env.JWT_TOKEN_SECRET??'',{expiresIn:"10d"})

        const response = NextResponse.json({
            success: true ,
            data: user,
            token:token,
            message:"logged in success",
        },{status:200})

        response.cookies.set('token',token,{
            httpOnly:true,
            sameSite:'none',
            path:'/',
            domain: process.env.NODE_ENV === 'production' ? 'saveyourlinks.vercel.app' : undefined ,
            secure:true,
            maxAge: 60 * 60 * 24 * 10,
        })

        return response;

    } catch (error) {
        console.log('error while signing',error);
        return NextResponse.json({
            success:false,
            message:`Error while signing , ${error}`
        },{status:400})
    }
}