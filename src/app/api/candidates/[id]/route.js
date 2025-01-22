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

    const { name, candidateId, party } = await req.json();

    if (!candidateId || !name || !party) {
      return NextResponse.json(
        { error: 'Name, candidateId, and party are required.' },
        { status: 400 }
      );
    }

    // Step 1: Find the document containing the candidate and the municipality
    const candidateDocument = await Candidate.findOne({
      $or: [
        { 'mayorCandidates._id': id },
        { 'deputyMayorCandidates._id': id },
      ],
    });

    if (!candidateDocument) {
      return NextResponse.json(
        { error: 'Candidate not found.' },
        { status: 404 }
      );
    }

    const { municipality } = candidateDocument;

    // Step 2: Check for duplicate candidateId across all municipalities
    const duplicateCandidateId = await Candidate.findOne({
      $or: [
        {
          'mayorCandidates.candidateId': candidateId,
          'mayorCandidates._id': { $ne: id }, // Exclude the current candidate
        },
        {
          'deputyMayorCandidates.candidateId': candidateId,
          'deputyMayorCandidates._id': { $ne: id }, // Exclude the current candidate
        },
      ],
    });

    if (duplicateCandidateId) {
      return NextResponse.json(
        { error: `A candidate with candidateId "${candidateId}" already exists.` },
        { status: 400 }
      );
    }

    // Step 3: Check for duplicate party across both mayor and deputy mayor candidates in the same municipality
    const duplicatePartyInMayor = await Candidate.findOne({
      municipality,
      'mayorCandidates.party': party,
      'mayorCandidates._id': { $ne: id }, // Exclude the current candidate
    });

    const duplicatePartyInDeputyMayor = await Candidate.findOne({
      municipality,
      'deputyMayorCandidates.party': party,
      'deputyMayorCandidates._id': { $ne: id }, // Exclude the current candidate
    });

    if (duplicatePartyInMayor || duplicatePartyInDeputyMayor) {
      return NextResponse.json(
        { error: `The party "${party}" already has a candidate in the municipality. A party cannot have candidates in both mayor and deputy mayor roles.` },
        { status: 400 }
      );
    }

    // Step 4: Update the candidate in the respective array
    const updatedMayor = await Candidate.findOneAndUpdate(
      { 'mayorCandidates._id': id },
      {
        $set: {
          'mayorCandidates.$.name': name,
          'mayorCandidates.$.candidateId': candidateId,
          'mayorCandidates.$.party': party,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedMayor) {
      return NextResponse.json(
        { message: 'Mayor candidate updated successfully', candidate: updatedMayor },
        { status: 200 }
      );
    }

    const updatedDeputyMayor = await Candidate.findOneAndUpdate(
      { 'deputyMayorCandidates._id': id },
      {
        $set: {
          'deputyMayorCandidates.$.name': name,
          'deputyMayorCandidates.$.candidateId': candidateId,
          'deputyMayorCandidates.$.party': party,
        },
      },
      { new: true, runValidators: true }
    );

    if (updatedDeputyMayor) {
      return NextResponse.json(
        { message: 'Deputy mayor candidate updated successfully', candidate: updatedDeputyMayor },
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
