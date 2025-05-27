import bcrypt from 'bcryptjs';
import { NextRequest } from "next/server";
import UserModel from "@/models/usermodel";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    await dbConnect();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
   
      return new Response(
        JSON.stringify({
          success: true,
          message: "Login successful",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid password",
        }),
        { status: 401 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred during login",
      }),
      { status: 500 }
    );
  }
}

