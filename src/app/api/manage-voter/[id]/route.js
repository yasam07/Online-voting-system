import mongoose from "mongoose";
import { User } from "../../../models/voter";

const mongoUrl = process.env.MONGO_URL;

const connectToDatabase = async () => {
  if (!mongoUrl) {
    throw new Error("MongoDB connection string is missing in environment variables.");
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  }
};

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Voter ID is required" }), { status: 400 });
    }

    const voter = await User.findById(id).select("-password");

    if (!voter) {
      return new Response(JSON.stringify({ error: "Voter not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ voter }), { status: 200 });
  } catch (error) {
    console.error("Error fetching voter:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching the voter" }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const data = await req.json();

    const updatedVoter = await User.findByIdAndUpdate(id, data, { new: true });

    if (!updatedVoter) {
      return new Response(JSON.stringify({ error: "Voter not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Voter updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating voter:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while updating the voter" }),
      { status: 500 }
    );
  }
}
