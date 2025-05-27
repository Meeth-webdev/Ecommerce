import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/usermodel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/SignupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username") || "", // ⬅️ fallback to empty string to avoid null
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors =
        result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is not taken",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in checking the username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking the username",
      },
      { status: 500 }
    );
  }
}