import { verifyToken } from "@/lib/authJWT";
import { dbConnection } from "@/lib/dbconnect";
import { LinkModel } from "@/models/link.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    await dbConnection();
    try {
        const reqBody = await request.json();
        const token = await verifyToken(request);
        
        if (!token) {
            return NextResponse.json({
                success:false,
                 message: "Invalid token" }, { status: 401 });
        }

        const { _id } = token.payload;
        const { link, title, tags } = reqBody;

        const newLink = new LinkModel({
            title: title ?? "No title has been given to this link",
            link,
            user:_id,
            tags
        })

        await newLink.save();

        return NextResponse.json({
            success:true,
            message:"successfully created link"
        },{status:200})

    } catch (error: any) {
        console.error("Error creating link:", error);
        return NextResponse.json({ 
            success:false,
            message: "An error occurred while creating the link", error: error.message }, { status: 500 });
    }
};
