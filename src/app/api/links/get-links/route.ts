import { verifyToken } from "@/lib/authJWT";
import { dbConnection } from "@/lib/dbconnect";
import { LinkModel } from "@/models/link.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnection();
  try {
    
    const token = await verifyToken(request)
    const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10);
    if (!token) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const { _id } = token.payload;

    const links = await LinkModel.aggregate([
      { $match: { 
        user: new mongoose.Types.ObjectId(_id) , 
        isDeleted: false 
      } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          title: 1,
          link: 1,
          tags: 1,
          createdAt: 1,
        },
      },
    ]);
    const response = NextResponse.json(
      {
        success: true,
        data: links,
        message: "Successfullt got the user links",
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    console.error("Error while getting links:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error while getting links , ${error}`,
      },
      { status: 500 }
    );
  }
}
