import { verifyToken } from "@/lib/authJWT";
import { dbConnection } from "@/lib/dbconnect";
import { LinkModel } from "@/models/link.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest) {
    await dbConnection();
     const {link_id} = await request.json();
     try {
        if (!link_id) {
            return NextResponse.json({   
                    success: false, 
                    message: "Invalid link" 
                }, { status: 400 });
        }
        const link = await LinkModel.findOne({
            _id:link_id,
            isDeleted:false
        })
        if (!link) {
            return NextResponse.json({
                success: false,
                message: "Link not found"
            }, { status: 404 });
        }

        link.isDeleted = true;
        await link.save()

        return NextResponse.json({
            success:true,
            message:"link deleted successfully"
        })
     } catch (error:any) {
        console.error("Error deleting link:", error);
        return NextResponse.json({ 
            success:false,
            message: "An error occurred while deleting the link", error: error.message }, 
            { status: 500 });
    }
}