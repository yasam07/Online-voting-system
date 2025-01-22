import { NextResponse } from "next/server";
import Candidate from "../../../../models/Candidate"; // Adjust the path if necessary
import mongoose from "mongoose";

// MongoDB connection function
const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};

export async function DELETE(request, { params }) {
  const { id } = params; // Extract the ID from the params
  console.log("Candidate ID to delete:", id);

  // Validate the ID
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Valid Candidate ID is required" }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectMongo();

    // Find and remove from mayorCandidates
    const mayorCandidate = await Candidate.findOneAndUpdate(
      { "mayorCandidates._id": id }, // Match the candidate in mayorCandidates
      { $pull: { mayorCandidates: { _id: id } } }, // Remove the candidate
      { new: true } // Return the updated document
    );

    if (mayorCandidate) {
      console.log("Deleted Mayor Candidate:", mayorCandidate);
      return NextResponse.json({ message: "Mayor Candidate deleted successfully" }, { status: 200 });
    }

    // Find and remove from deputyMayorCandidates
    const deputyMayorCandidate = await Candidate.findOneAndUpdate(
      { "deputyMayorCandidates._id": id }, // Match the candidate in deputyMayorCandidates
      { $pull: { deputyMayorCandidates: { _id: id } } }, // Remove the candidate
      { new: true } // Return the updated document
    );

    if (deputyMayorCandidate) {
      console.log("Deleted Deputy Mayor Candidate:", deputyMayorCandidate);
      return NextResponse.json({ message: "Deputy Mayor Candidate deleted successfully" }, { status: 200 });
    }

    // If the candidate is not found in either collection
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
