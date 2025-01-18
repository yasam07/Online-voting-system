import mongoose from 'mongoose';
import Candidate from '../../../models/Candidate';  // Adjust the path to your model
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

// DELETE handler for deleting a candidate
export async function DELETE(req) {
    console.log(req)
//   const { district, municipality, postType, candidateId } = await req.json();

//   if (!district || !municipality || !postType || !candidateId) {
//     return NextResponse.json({ error: 'Required data is missing' }, { status: 400 });
//   }

  try {
    await connectToDatabase();

    // Pull the candidate from the mayor or deputy mayor candidates array
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { district, municipality },
      {
        $pull: {
          [`${postType}`]: { _id: mongoose.Types.ObjectId(candidateId) },  // Ensure the candidateId is treated as an ObjectId
        }
      },
      { new: true }
    );

    if (!updatedCandidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Candidate deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate', details: error.message }, { status: 500 });
  }
}
