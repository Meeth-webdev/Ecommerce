import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/usermodel";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { code,username } = await request.json();

    const user = await UserModel.findOne({username, verifyCode: code, isVerified: false });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "The verification code doesn't match or the user is already verified.",
        }),
        { status: 404 }
      );
    }

    // Mark user as verified and clear the code
    user.isVerified = true;
    user.verifyCode = "undefined"; // optional: clean up
    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account successfully verified.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error while verifying user",
      }),
      {
        status: 500,
      }
    );
  }
}