import { dbConnection } from "@/lib/dbconnect";
import {userModel } from "@/models/user.model";
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";
import { signupValidation, UserInput } from "@/schema/signupSchema";

export async function POST(request:NextRequest) {
    await dbConnection();

    try {
        const body = await request.json();
        const parseResult = signupValidation.safeParse(body)

        if (!parseResult.success) {
            return NextResponse.json({
                success: false,
                message: parseResult.error.errors.map(err => err.message).join(", ")
              }, { status: 400 });
        }

        const {username,email,password}:UserInput = parseResult.data as UserInput;

        const existingUsername = await userModel.findOne({username});

        if (existingUsername) {
            return NextResponse.json({
                success:false,
                message:"username already exists"
            },{status:400})
        }

        const existingEmail = await userModel.findOne({email});

        if (existingEmail) {
            return NextResponse.json({
                success:false,
                message:"user already exists with email"
            },{status:400})
        }

        const hashedPass = await bcrypt.hash(password,10);

        const user = new userModel({
            username,
            email,
            password:hashedPass,
        })

        user.save();

        return NextResponse.json({message:'user registered successfully'},
            {status:200})

    } catch (error) {
        console.log('error while signingup',error);
        return NextResponse.json({
            success:false,
            message:`Error while signing up , ${error}`
        },{status:400})
    }
}