import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { ResetEmailSender } from "@/helpers/ResetEmailSender";
import UserModel from "@/models/usermodel";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email } = await request.json();

    const user = await UserModel.findOne({ email });

    if (!user || !user.isVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found or not verified",
        }),
        { status: 404 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Update the existing user's reset code and expiry
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = expiryDate;
    await user.save();

    const emailResponse = await ResetEmailSender(email, verifyCode);

    if (!emailResponse) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "The email was not sent",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "The code was sent to your email",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset code:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
}