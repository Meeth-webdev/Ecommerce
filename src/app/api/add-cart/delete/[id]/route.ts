import AddCartModel from "../../../../../models/AddCartmodel";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    // ✅ Correctly extract the ID from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    const response = await AddCartModel.findByIdAndDelete(id);
    if (!response) {
      return new Response("Unable to delete the particular product", {
        status: 400,
      });
    }

  return  Response.json({
    success:true,
    description:"The product was removed succesfully"
  
   })
  } catch (error) {
    console.log("There was some error", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}