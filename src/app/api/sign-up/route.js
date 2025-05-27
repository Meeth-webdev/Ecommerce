import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/models/usermodel";
import { EmailSender } from "@/helpers/EmailSender";
export async function POST(request) {
    await dbConnect(); // Make sure dbConnect is awaited
    try {
        const { username, email, password } = await request.json();
        const verifiedUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (verifiedUsername) {
            return new Response(JSON.stringify({
                success: "false",
                message: "Username already exists",
            }), { status: 400 });
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserByEmail = await UserModel.findOne({
            email,
        });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(JSON.stringify({
                    success: "false",
                    message: "The email already exists",
                }), { status: 400 });
            }
            else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.isVerified = true;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });
            await newUser.save();
        }
        const emailResponse = await EmailSender(username, email, verifyCode);
        if (!emailResponse) {
            return new Response(JSON.stringify({
                success: "false",
                message: "The email was not sent",
            }), { status: 500 });
        }
        return new Response(JSON.stringify({
            success: "true",
            message: "The email was sent",
        }), { status: 201 });
    }
    catch (error) {
        console.error("Error registering user", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error registering user",
        }), {
            status: 500,
        });
    }
}
