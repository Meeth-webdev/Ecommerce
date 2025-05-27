import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // your db connect function
import ProductModel from '@/models/productmodel';// your product model
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if(!session){
        return new Response("Unauthorized", { status: 401 });
   }
    const { id } = context.params; // ✅ get id properly

    await dbConnect();

    const product = await ProductModel.findById(id);

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}