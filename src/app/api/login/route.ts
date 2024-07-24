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
            })
        }

        const isPasswordValid = await bcrypt.compare(String(parsedResult.password),String(user.password))

        if (!isPasswordValid) {
            return NextResponse.json({
                message:"Invalid password"
            },{status:401})
        }

        const tokendata = {
            id: user._id,
            username: user.username,
            email: user.email
         }

         const token = await jwt
         .sign(tokendata,process.env.JWT_TOKEN_SECRET??'',{expiresIn:"10d"})

        const response = NextResponse.json({
            message:"logged in success",
            success: true
        },{status:200})

        response.cookies.set('token',token,{
            httpOnly:true
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