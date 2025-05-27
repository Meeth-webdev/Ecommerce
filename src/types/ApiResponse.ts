import { Message } from "@/models/usermodel";
export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessage?:any
    messages?:Array<Message>
}