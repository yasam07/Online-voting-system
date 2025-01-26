import Election from "../../../../models/Election"; // Your Election model
import mongoose from "mongoose";

// Connect to the database
async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) throw new Error("MongoDB connection string not defined.");

  await mongoose.connect(MONGO_URL);
}

export async function PUT(req, { params }) {
  try {
    await connectDatabase();

    const { id } = params; // Extract election ID
    const { municipality } = await req.json(); // Extract municipality from the request body

    if (!id || !municipality) {
      return new Response("Election ID and municipality are required", { status: 400 });
    }

    const election = await Election.findById(id);
    if (!election) {
      return new Response("Election not found", { status: 404 });
    }

    // Ensure the municipality is added to the `disabledMunicipalities` field
    if (!election.disabledMunicipalities.includes(municipality)) {
      election.disabledMunicipalities.push(municipality);
    }

    await election.save();

    return new Response("Municipality added to disabledMunicipalities successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating disabledMunicipalities:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
