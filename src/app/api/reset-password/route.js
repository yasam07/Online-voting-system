import mongoose from "mongoose";
import { User } from "../../models/voter";
import bcrypt from "bcryptjs";

// Helper function to ensure the database connection
async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) { // Not connected
        try {
            await mongoose.connect(process.env.MONGO_URL, {
                serverSelectionTimeoutMS: 30000, // Increased timeout
            });
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Database connection error:", error);
            throw new Error("Failed to connect to the database");
        }
    }
}

export async function PATCH(req) {
    try {
        // Ensure the database connection is established
        await connectToDatabase();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        // Validate password length
        if (password.length < 5) {
            return new Response(JSON.stringify({ error: "Password must be at least 5 characters long" }), { status: 400 });
        }

        // Find the user by email
        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            return new Response(JSON.stringify({ error: "User with the given email not found" }), { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return new Response(JSON.stringify({ message: "Password reset successfully!" }), { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        return new Response(JSON.stringify({ error: "An error occurred while resetting the password" }), { status: 500 });
    }
}
