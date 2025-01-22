// pages/api/vote.js
import mongoose from 'mongoose';
import { encryptFeistel } from '../../../libs/encryption';
import Vote from '../../models/Vote';
import CandidateVoteCount from '../../models/CandidateVoteCount';

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

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
      electionId,
    } = await req.json();

    if (!voterId || !district || !municipality || !mayorId || !deputyMayorId || !mayorParty || !deputyMayorParty || !electionId) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Check if the voter has already voted
    const existingVote = await Vote.findOne({ voterId, electionId });
    if (existingVote) {
      return new Response(
        JSON.stringify({ message: 'You have already submitted your vote for this election.' }),
        { status: 400 }
      );
    }

    const key = 5; // Encryption key

    // Encrypt candidate IDs
    const encryptedMayorId = encryptFeistel(mayorId.toString(), key);
    const encryptedDeputyMayorId = encryptFeistel(deputyMayorId.toString(), key);

    const voteData = {
      voterId,
      district,
      municipality,
      mayorId: encryptedMayorId,
      deputyMayorId: encryptedDeputyMayorId,
      mayorParty,
      deputyMayorParty,
      electionId,
      timestamp: new Date(),
    };

    // Save the vote and update vote counts
    await Vote.create(voteData);
    await updateVoteCount(encryptedMayorId, encryptedDeputyMayorId, electionId);

    return new Response(
      JSON.stringify({ message: 'Vote submitted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting vote:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}

// Function to update vote count
const updateVoteCount = async (encryptedMayorId, encryptedDeputyMayorId, electionId) => {
  try {
    const voteCount = await CandidateVoteCount.findOne({
      mayorId: encryptedMayorId,
      deputyMayorId: encryptedDeputyMayorId,
      electionId,
    });

    if (voteCount) {
      voteCount.mayorVotes += 1;
      voteCount.deputyMayorVotes += 1;
      await voteCount.save();
    } else {
      await CandidateVoteCount.create({
        mayorId: encryptedMayorId,
        mayorVotes: 1,
        deputyMayorId: encryptedDeputyMayorId,
        deputyMayorVotes: 1,
        electionId,
      });
    }
  } catch (error) {
    console.error('Error updating vote count:', error);
  }
};
