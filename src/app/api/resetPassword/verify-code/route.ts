import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/usermodel";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { code } = await request.json();

    const user = await UserModel.findOne({ verifyCode: code });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid or expired verification code.",
        }),
        { status: 404 }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification code has expired.",
        }),
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      user.isVerified = true;
    }


    user.verifyCode = "null";
    user.verifyCodeExpiry =new Date(0);

    await user.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification successful.",
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
      { status: 500 }
    );
  }
}