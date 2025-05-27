import AddCartModel from "@/models/AddCartmodel";
import ProductModel from "@/models/productmodel";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    // ✅ Extract the ID correctly
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response("Invalid product ID", { status: 400 });
    }

    // ✅ Check if the product already exists in the cart
    const existingCartProduct = await AddCartModel.findOne({ productId: id });

    if (existingCartProduct) {
      return Response.json({
        success: false,
        message: "The product already exists in the cart",
      });
    }

    // ✅ Fetch the product details from ProductModel
    const product = await ProductModel.findById(id);

    if (!product) {
      return Response.json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Create a new AddCart entry with full product details
    const addCartProduct = await AddCartModel.create({
      productId: product._id,
      product: product.product,
      price: product.price,
      images: product.images,
      userEmail:product.userEmail
      // ✨ add other fields you need
    });

    return Response.json({
      success: true,
      message: "Product added to cart successfully",
      addCartProduct,
    });
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