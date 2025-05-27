import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import UserModel from "@/models/usermodel";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(request: NextRequest) {
  try {
    // Get the request body data
    const { newPassword,email } = await request.json();
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Connect to the database
    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return new Response(
        JSON.stringify({
          success: "false",
          message: "User not found.",
        }),
        { status: 404 }
      );
    }

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    // Send success response
    return new Response(
      JSON.stringify({
        success: "true",
        message: "Password updated successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: "false",
        message: "An error occurred while updating the password.",
      }),
      { status: 500 }
    );
  }
}