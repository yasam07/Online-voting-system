// src/app/api/result/route.js
import mongoose from 'mongoose';
import CandidateVoteCount from '../../models/CandidateVoteCount'; 


const connectMongo = async () => {
  if (mongoose.connections[0].readyState) return;  
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};


export async function GET(req) {
  await connectMongo();

  try {
  
    const voteCounts = await CandidateVoteCount.find();

    if (!voteCounts || voteCounts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No vote counts found' }),
        { status: 404 }
      );
    }

    
    const results = voteCounts.map((voteCount) => ({
      mayorId: voteCount.mayorId,
      mayorVotes: voteCount.mayorVotes,
      deputyMayorId: voteCount.deputyMayorId,
      deputyMayorVotes: voteCount.deputyMayorVotes,
    }));

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
