import { authjwt } from "@/lib/authJWT";
import { dbConnection } from "@/lib/dbconnect";
import { LinkModel } from "@/models/link.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    await dbConnection();
    try {
        const reqBody = await request.json();
        const token = await authjwt(request);
        
        if (!token) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const { user } = token;
        const { link, title, tags } = reqBody;


    } catch (error: any) {
        console.error("Error creating link:", error);
        return NextResponse.json({ message: "An error occurred while creating the link", error: error.message }, { status: 500 });
    }
};
