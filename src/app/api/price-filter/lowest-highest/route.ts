import ProductModel from "@/models/productmodel";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    await dbConnect();
    const response = await ProductModel.aggregate([
     
      {
        $sort: {
          price: 1,
        },
      },
      {
        $addFields: {
          numericPrice: {
            $convert: {
              input: {
                $replaceAll: {             
                  input: {                   
                    $replaceAll: {
                      input: "$price",
                      find: { $literal: "$" },
                      replacement: { $literal: "" }
                    }
                  },
                  find: { $literal: "," },   
                  replacement: { $literal: "" }
                }
              },
              
              to: "double",
              onError: 0.0, 
              onNull: 0.0,
            },
          },
        },
      },
      {
        $sort: {
          numericPrice: 1, 
        },
      },
    ]);
    console.log("First product price:", response[0]?.price, response[0]?.numericPrice);
    if (!response) {
      return new Response("Was not able to filter according to the price", { status: 400 });
    }
    return Response.json(response, { status: 200 });
  } catch (error: any) {
    console.error("There was some error:", error.message);
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}