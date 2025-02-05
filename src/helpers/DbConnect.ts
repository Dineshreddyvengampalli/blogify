import mongoose from "mongoose";
import config from "./config";

mongoose.connection.on("connected", () => {
    console.log("🔗 Mongoose connected!");
});

mongoose.connection.on("disconnected", () => {
    console.log("⚡ Mongoose disconnected!");
});

export default async function connectToDb() {
    if (mongoose.connection.readyState === 0) {  // 0 = disconnected
        await mongoose.connect(config.mongoDB.connectionUrl);
        console.log("✅ MongoDB Connected!");
    }
}
