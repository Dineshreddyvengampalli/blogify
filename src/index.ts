import app from "./app";
import connectToDb from "./helpers/DbConnect";
import mongoose from "mongoose";

async function startServer() {
    try {
        await connectToDb(); // Connect once

        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, function () {
            console.log("🚀 Server running on http://localhost:" + PORT);
        });

        // Handle graceful shutdown
        process.on("SIGINT", async () => {
            console.log("🛑 SIGINT received. Closing MongoDB connection...");
            await mongoose.disconnect();
            console.log("⚡ MongoDB Disconnected!");
            server.close(() => {
                console.log("💀 Server Stopped");
                process.exit(0);
            });
        });

        process.on("SIGTERM", async () => {
            console.log("🛑 SIGTERM received. Closing MongoDB connection...");
            await mongoose.disconnect();
            console.log("⚡ MongoDB Disconnected!");
            server.close(() => {
                console.log("💀 Server Stopped");
                process.exit(0);
            });
        });

        process.on("uncaughtException", (err) => {
            console.error("🔥 Uncaught Exception:", err);
            process.exit(1);
        });

        process.on("unhandledRejection", (reason, promise) => {
            console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
        });

    } catch (error) {
        console.error("❌ Failed to Start Server:", error);
        process.exit(1);
    }
}

startServer();
