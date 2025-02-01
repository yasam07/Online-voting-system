import mongoose from 'mongoose';
import CandidateVoteCount from '../../models/CandidateVoteCount';
import { decryptRSA, generateRSAKeys } from '../../../libs/encryption'; // Import RSA decryption function

// Generate RSA keys (Private key will be used for decryption)
const { privateKey } = generateRSAKeys(); // Normally, you'd want to securely store the private key

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

    const results = voteCounts.map((voteCount) => {
      // Decrypt the mayor and deputy mayor IDs using RSA decryption
      const decryptedMayorId = decryptRSA(voteCount.mayorId, privateKey);
      const decryptedDeputyMayorId = decryptRSA(voteCount.deputyMayorId, privateKey);

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
