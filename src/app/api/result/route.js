// pages/api/result.js
import mongoose from 'mongoose';
import CandidateVoteCount from '../../models/CandidateVoteCount';
import { decryptFeistel } from '../../../libs/encryption';

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function GET() {
  await connectMongo();

  try {
    const voteCounts = await CandidateVoteCount.find();

    if (!voteCounts || voteCounts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No vote counts found' }),
        { status: 404 }
      );
    }

    const key = 5;

    const results = voteCounts.map((voteCount) => {
      const decryptedMayorId = decryptFeistel(voteCount.mayorId, key);
      const decryptedDeputyMayorId = decryptFeistel(voteCount.deputyMayorId, key);

      return {
        mayorId: decryptedMayorId,
        mayorVotes: voteCount.mayorVotes,
        deputyMayorId: decryptedDeputyMayorId,
        deputyMayorVotes: voteCount.deputyMayorVotes,
      };
    });

    return new Response(
      JSON.stringify(results),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching vote counts:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error.' }),
      { status: 500 }
    );
  }
}
