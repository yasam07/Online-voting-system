import mongoose from 'mongoose';
import { encryptVote } from '../../../libs/encryption';
import Vote from '../../models/Vote';
import CandidateVoteCount from '../../models/CandidateVoteCount';

// MongoDB connection setup
const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;  // Skip if already connected
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// POST request to submit a vote
export async function POST(req) {
  await connectMongo();

  try {
    const {
      voterId,
      district,
      municipality,
      mayorId,
      deputyMayorId,
      mayorParty,
      deputyMayorParty,
    } = await req.json();

    // Validate input fields
    if (!voterId || !district || !municipality || !mayorId || !deputyMayorId || !mayorParty || !deputyMayorParty) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Check if the voter has already voted
    const existingVote = await Vote.findOne({ voterId });
    if (existingVote) {
      return new Response(
        JSON.stringify({ message: 'You have already submitted your vote.' }),
        { status: 400 }
      );
    }

    // Encrypt the mayor and deputy mayor IDs before saving
    const encryptedMayorId = encryptVote(mayorId);
    const encryptedDeputyMayorId = encryptVote(deputyMayorId);

    // Create vote object with encrypted data
    const voteData = {
      voterId,
      district,
      municipality,
      mayorId: encryptedMayorId,
      deputyMayorId: encryptedDeputyMayorId,
      mayorParty,
      deputyMayorParty,
      timestamp: new Date(),
    };

    // Save the vote in the database
    const result = await Vote.create(voteData);

    if (result) {
      // Update the vote count for the mayor and deputy mayor
      await updateVoteCount(mayorId, deputyMayorId);

      return new Response(
        JSON.stringify({ message: 'Vote submitted successfully' }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Error submitting vote. Please try again.' }),
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error submitting vote:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}

// Function to update the vote count for the mayor and deputy mayor
const updateVoteCount = async (mayorId, deputyMayorId) => {
  try {
    // Find or create the vote count entry for the mayor and deputy mayor
    const existingVoteCount = await CandidateVoteCount.findOne({ mayorId, deputyMayorId });

    if (existingVoteCount) {
      // Increment the vote counts
      existingVoteCount.mayorVotes += 1;
      existingVoteCount.deputyMayorVotes += 1;
      await existingVoteCount.save();
    } else {
      // Create a new entry for the vote count
      const newVoteCount = new CandidateVoteCount({
        mayorId,
        mayorVotes: 1,
        deputyMayorId,
        deputyMayorVotes: 1,
      });
      await newVoteCount.save();
    }
  } catch (error) {
    console.error('Error updating vote count:', error);
  }
};
