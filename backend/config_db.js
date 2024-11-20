import mongoose from "mongoose";
const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("connection successful to the database");
    } catch (error) {
        console.error(error.message);
    }
};

export default connectDb;