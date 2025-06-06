import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/usermodel";
 
export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                  const user=  await UserModel.findOne({
                    $or: [
                        { email: credentials.identifier },
                        { username: credentials.identifier }
                       ] 
                    })
                    if(!user){
                        throw new Error('no user found with this email ')
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account first ")
                    }
                  const isPasswordCorrect=  await bcrypt.compare(credentials.password,user.password)
                  if(isPasswordCorrect){
                    return user
                  }
                  else{
                    throw new Error("Incorrect password ")
                  }

                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        
        async session({ session,  token }) { //in this token is then shared to the seesion 
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.username=token.username
            }
          return session

        },
        async jwt({ token, user }) { // so in this the user is came from the user which we returned and is stored in jwt 
            if(user){
                token._id=user._id?.toString()
                token.isVerified=user.isVerified;
                token.username=user.username
            }
          return token
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
      // ✅ Add cookie config for production
  cookies:
  process.env.NODE_ENV === "production"
    ? {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain: ".ecom-store.in", // ✅ use your custom domain here
          },
        },
      }
    : undefined, // keep default in development

    

    secret:process.env.NEXTAUTH_SECRET ,
    
}