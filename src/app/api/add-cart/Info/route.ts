import AddCartModel from "@/models/AddCartmodel";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    console.log("🔐 Server session:", session);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

   
    const userCartItems = await AddCartModel.find({
      userEmail: session.user?.email,
    });

    return Response.json({
      success: true,
      products: userCartItems,
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}