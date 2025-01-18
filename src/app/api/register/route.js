import mongoose from "mongoose";
import { User } from "../../models/voter";
import fs from "fs";
import path from "path";
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

export async function POST(req) {
    try {
        // Ensure the database connection is established
        await connectToDatabase();

        const body = await req.json();

        // Destructure and validate required fields
        const { fullName, phoneNumber, fatherName, nationalId, dateOfBirth, gender, password, district, municipality } = body;
        if (!fullName || !phoneNumber || !fatherName || !dateOfBirth || !gender || !password || !nationalId || !district || !municipality ) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        // Standardize input data to uppercase and format date of birth
        const fullNameUpper = fullName.toUpperCase();
        const fatherNameUpper = fatherName.toUpperCase();
        const nationalIdUpper = nationalId.toUpperCase();
        const districtUpper = district.toUpperCase();
        const municipalityUpper = municipality.toUpperCase();

        const dateOfBirthFormatted = new Date(dateOfBirth).toISOString().split("T")[0]; // Format to "YYYY-MM-DD"

        // Validate gender
        const validGenders = ["Male", "Female", "Other"];
        const genderFormatted = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        if (!validGenders.includes(genderFormatted)) {
            return new Response(JSON.stringify({ error: "Invalid gender provided" }), { status: 400 });
        }

        // Validate phone number (Optional: you can add more specific validation for the format)
        const phoneNumberFormatted = phoneNumber.trim();
        if (!/^\+?\d{10,15}$/.test(phoneNumberFormatted)) {  // Simple regex for phone number validation
            return new Response(JSON.stringify({ error: "Invalid phone number format" }), { status: 400 });
        }

        // Resolve the file path and read NationalData.json
        const jsonFilePath = path.resolve(process.cwd(), "public", "NationalData.json");
        if (!fs.existsSync(jsonFilePath)) {
            return new Response(JSON.stringify({ error: "National data file not found" }), { status: 500 });
        }

        const fileData = fs.readFileSync(jsonFilePath, "utf-8");
        let jsonData;
        try {
            jsonData = JSON.parse(fileData);
        } catch (error) {
            return new Response(JSON.stringify({ error: "Error parsing national data file" }), { status: 500 });
        }

        // Check if nationalId already exists in the database
        const nationalIdExists = await User.findOne({ nationalId: nationalIdUpper });
        if (nationalIdExists) {
            return new Response(JSON.stringify({ error: "National ID already exists" }), { status: 400 });
        }

        // Check if phone number already exists in the database
        const phoneNumberExists = await User.findOne({ phoneNumber: phoneNumberFormatted });
        if (phoneNumberExists) {
            return new Response(JSON.stringify({ error: "Phone number already exists" }), { status: 400 });
        }

        // Find the user by nationalId in NationalData.json
        const matchedUser = jsonData.find(user => (user.nationalId || "").toUpperCase() === nationalIdUpper);
        if (!matchedUser) {
            return new Response(JSON.stringify({ error: "National ID not found in national data" }), { status: 400 });
        }

        // Validate the remaining user information
        if (
            matchedUser.fullName.toUpperCase() !== fullNameUpper ||
            matchedUser.fatherName.toUpperCase() !== fatherNameUpper ||
            new Date(matchedUser.dateOfBirth).toISOString().split("T")[0] !== dateOfBirthFormatted ||
            matchedUser.gender.toLowerCase() !== genderFormatted.toLowerCase() ||
            matchedUser.district.toUpperCase() !== districtUpper ||
            matchedUser.municipality.toUpperCase() !== municipalityUpper
        ) {
            return new Response(JSON.stringify({ error: "User information does not match national data" }), { status: 400 });
        }

        // Validate password length
        if (password.length < 5) {
            return new Response(JSON.stringify({ error: "Password must be at least 5 characters long" }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        const createdUser = await User.create({
            fullName: fullNameUpper,
            fatherName: fatherNameUpper,
            phoneNumber: phoneNumberFormatted,  // Store phone number
            nationalId: nationalIdUpper,
            dateOfBirth: dateOfBirthFormatted,
            gender: genderFormatted,
            password: hashedPassword,
            district: districtUpper,
            municipality: municipalityUpper,
            admin: false
        });

        // Exclude password before sending response
        const { password: _, ...userWithoutPassword } = createdUser.toObject();

        return new Response(JSON.stringify({ message: "User created successfully", user: userWithoutPassword }), { status: 201 });
    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(JSON.stringify({ error: "An error occurred during registration" }), { status: 500 });
    }
}
