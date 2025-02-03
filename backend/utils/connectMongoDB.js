import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`MongoDB Connected : ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectMongoDB;