import dbConnect from "@/lib/dbConnect.js";
import ProductModel from "@/models/productmodel";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const response = await ProductModel.aggregate([
      {
        $match: {
          product: { $regex: search, $options: "i" }, 
        },
      },
      {
        $project: {
          _id: 1,
          product: 1,
          price: 1,
          images: 1, 
          description: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    if (!response || response.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No products found",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        products: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("There was an error: ", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}