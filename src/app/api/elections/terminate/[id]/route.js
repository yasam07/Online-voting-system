// /app/api/elections/terminate/[id]/route.js

import Election from "../../../../models/Election"; // Your model
import mongoose from "mongoose";

// Database connection
async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      throw new Error("MongoDB connection string not defined.");
    }
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDatabase();
    
    // Destructure the 'id' from params
    const { id } = params; 
    console.log(id)
    if (!id) {
      return new Response('ID parameter is missing', { status: 400 });
    }

    // Your logic for updating the election (e.g., updating database, etc.)
    const election = await Election.findById(id); // Example logic

    if (!election) {
      return new Response('Election not found', { status: 404 });
    }

    // Set the endTime to the current time
    election.endTime = new Date();  // Set current time as endTime
    await election.save();

    return new Response('Election end time updated successfully', { status: 200 });

  } catch (error) {
    console.error('Error updating election end time:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
