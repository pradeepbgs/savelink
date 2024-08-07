import { verifyToken } from "@/lib/authJWT";
import { dbConnection } from "@/lib/dbconnect";
import { LinkModel } from "@/models/link.model";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request:NextRequest) {
    await dbConnection();
    const token = await verifyToken(request)
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
     const {link_id} = await request.json();
     const user_id = token._id;
     try {
        if (!link_id) {
            return NextResponse.json({   
                    success: false, 
                    message: "Invalid link" 
                }, { status: 400 });
        }
        const link = await LinkModel.findOne({
            _id:link_id,
            user:user_id,
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