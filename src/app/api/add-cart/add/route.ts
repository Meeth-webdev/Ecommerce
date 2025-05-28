import AddCartModel from "../../../../models/AddCartmodel";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";
import ProductModel from "@/models/productmodel"; 

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });
    console.log("Session:", session);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { productId, product, price, images, description,id } = body;


    if (product && price && images && description) {
      
      const productData = { productId, product, price, images,description };

  
      const existingProduct = await AddCartModel.findOne({
        productId: productData.productId.toString(),
        userEmail: session.user?.email,
      });

      if (existingProduct) {
        return Response.json(
          { success: false, message: "Product already exists in cart" },
          { status: 409 }
        );
      }

     
      const createdProduct = await AddCartModel.create({
        productId: productData.productId,
        product: productData.product,
        price: productData.price,
        images: productData.images,
        userEmail: session.user?.email,
      });

      return Response.json(
        { success: true, message: "Product added to cart", product: createdProduct },
        { status: 201 }
      );
    } 

    // 🧠 If only the ID is sent (product page case), fetch the product
    else if (id) {
      // Fetch product details from Product collection
      const fetchedProduct = await ProductModel.findById(id);

      if (!fetchedProduct) {
        return Response.json({ success: false, message: "Product not found" }, { status: 404 });
      }

      const productData = {
        id: fetchedProduct._id,
        product: fetchedProduct.product,
        price: fetchedProduct.price,
        images: fetchedProduct.images,
        description: fetchedProduct.description,
      };

      // 🛡 Check if product already exists in user's cart
      const existingProduct = await AddCartModel.findOne({
        productId: productData.id,
        userEmail: session.user?.email,
      });

      if (existingProduct) {
        return Response.json(
          { success: false, message: "Product already exists in cart" },
          { status: 409 }
        );
      }

      // 🛒 Add to cart
      const createdProduct = await AddCartModel.create({
        productId: productData.id,
        product: productData.product,
        price: productData.price,
        images: productData.images,
        description: productData.description,
        userEmail: session.user?.email,
      });

      return Response.json(
        { success: true, message: "Product added to cart", product: createdProduct },
        { status: 201 }
      );
    } 

    // 🧠 If neither product nor id is provided, handle as error
    else {
      return Response.json(
        { success: false, message: "Invalid request, product or id required" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("There was some error:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}