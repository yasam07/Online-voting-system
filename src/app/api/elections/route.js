import mongoose from 'mongoose';
import Election from '../../models/Election';
import { nanoid } from 'nanoid'; // Import nanoid for unique ID generation

const mongoUrl = process.env.MONGO_URL;

const connectToDatabase = async () => {
  if (!mongoUrl) {
    throw new Error('MongoDB connection string is missing in environment variables.');
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  }
};



  
export async function POST(req) {
  try {
    await connectToDatabase();

    const { name, startTime, endTime, electionId } = await req.json();

    // Validate required fields
    if (!name || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ error: 'All fields (name, startTime, endTime) are required.' }),
        { status: 400 }
      );
    }

    if (new Date(endTime) <= new Date(startTime)) {
      return new Response(
        JSON.stringify({ error: 'End time must be after start time.' }),
        { status: 400 }
      );
    }

    // Check if any election is currently running in the requested timeframe
    const conflictingElection = await Election.findOne({
      $or: [
        {
          startTime: { $lte: new Date(endTime) },
          endTime: { $gte: new Date(startTime) },
        },
      ],
    });

    if (conflictingElection) {
      return new Response(
        JSON.stringify({
          error: `An election (${conflictingElection.name}) is already running during the requested time frame.`,
        }),
        { status: 400 }
      );
    }

    // Generate electionId if not provided
    const uniqueElectionId = electionId || nanoid(10);

    // Check if electionId already exists
    const existingElection = await Election.findOne({ electionId: uniqueElectionId });
    if (existingElection) {
      return new Response(
        JSON.stringify({ error: 'Election ID already exists. Please use a unique ID.' }),
        { status: 400 }
      );
    }

    // Create and save election
    const election = new Election({ name, startTime, endTime, electionId: uniqueElectionId });
    await election.save();

    return new Response(
      JSON.stringify({ message: 'Election created successfully.', election }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during election creation:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create the election.' }),
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await connectToDatabase();
    const elections = await Election.find(); 
    return new Response(JSON.stringify({ elections }), { status: 200 });
  } catch (error) {
    console.error('Error fetching elections:', error.message);  // More detailed logging
    return new Response(
      JSON.stringify({ error: 'Failed to fetch elections.' }),
      { status: 500 }
    );
  }
}

