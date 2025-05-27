import ProductModel from "@/models/productmodel";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";


export async function GET() {
  await dbConnect();

  const totalProducts = await ProductModel.countDocuments();
  const randomIndexes = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * totalProducts)
  );

  const randomProducts = await Promise.all(
    randomIndexes.map(async (index) => {
      return await ProductModel.findOne().skip(index).limit(1);
    })
  );

  return new Response(JSON.stringify(randomProducts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}