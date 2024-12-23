//File check kết nối
import mongoose from "mongoose";

export const connect = async (): Promise<void> =>  {//Vì có async nên phải thêm Promise
    const url: string =  process.env.MONGO_URL as string;   
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB! Successfully");
    } catch (err) {
        console.error("Failed to connect to MongoDB");
    }
}