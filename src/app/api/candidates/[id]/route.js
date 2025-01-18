import mongoose from 'mongoose';
import Candidate from '../../../models/Candidate'; // Adjust the path as needed
import { NextResponse } from 'next/server';

// Helper function to connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Database connection failed');
    }
  }
};

// Helper function to check if the ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT handler for updating a candidate
export async function PUT(req, { params }) {
  const { id } = params;

  if (!id || !isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Valid Candidate ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const updatedData = await req.json(); // Parse the updated data from the request body

    // Attempt to update the candidate in both arrays
    const updatedMayor = await Candidate.findOneAndUpdate(
      { 'mayorCandidates._id': id },
      { $set: { 'mayorCandidates.$': updatedData } },
      { new: true, runValidators: true }
    );

    if (updatedMayor) {
      return NextResponse.json(
        { message: 'Candidate updated successfully', candidate: updatedMayor },
        { status: 200 }
      );
    }

    const updatedDeputyMayor = await Candidate.findOneAndUpdate(
      { 'deputyMayorCandidates._id': id },
      { $set: { 'deputyMayorCandidates.$': updatedData } },
      { new: true, runValidators: true }
    );

    if (updatedDeputyMayor) {
      return NextResponse.json(
        { message: 'Candidate updated successfully', candidate: updatedDeputyMayor },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to update candidate', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a candidate



// GET handler for retrieving a candidate
export async function GET(req, { params }) {
  const { id } = params;
  console.log(id)
  if (!id || !isValidObjectId(id)) {
    return NextResponse.json({ error: 'Valid Candidate ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Search in both fields
    const mayorCandidate = await Candidate.findOne(
      { 'mayorCandidates._id': id },
      { 'mayorCandidates.$': 1 }
    );

    if (mayorCandidate) {
      return NextResponse.json(mayorCandidate.mayorCandidates[0], { status: 200 });
    }

    const deputyMayorCandidate = await Candidate.findOne(
      { 'deputyMayorCandidates._id': id },
      { 'deputyMayorCandidates.$': 1 }
    );

    if (deputyMayorCandidate) {
      return NextResponse.json(deputyMayorCandidate.deputyMayorCandidates[0], { status: 200 });
    }

    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  } catch (error) {
    console.error('Error retrieving candidate:', error);
    return NextResponse.json({ error: 'Failed to retrieve candidate', details: error.message }, { status: 500 });
  }
}
