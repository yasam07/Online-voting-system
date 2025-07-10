import mongoose from 'mongoose';
import Election from '../../../models/Election';

const mongoUrl = process.env.MONGO_URL;

// Database connection
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

// GET: Fetch a specific election by ID
export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Election ID is required.' }),
        { status: 400 }
      );
    }

    const election = await Election.findById(id);
    if (!election) {
      return new Response(
        JSON.stringify({ error: 'Election not found.' }),
        { status: 404 }
      );
    }

    // Ensure only district and municipality are returned if they exist
    const { district, municipality, ...rest } = election.toObject();
    const filteredElection = {
      ...rest,
      ...(district ? { district } : {}),
      ...(municipality ? { municipality } : {}),
    };

    console.log('Fetched election:', filteredElection);
    return new Response(JSON.stringify({ election: filteredElection }), { status: 200 });
  } catch (error) {
    console.error('Error fetching election:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch election.' }),
      { status: 500 }
    );
  }
}

// DELETE: Remove a specific election by ID
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Election ID is required.' }),
        { status: 400 }
      );
    }

    const deletedElection = await Election.findByIdAndDelete(id);
    if (!deletedElection) {
      return new Response(
        JSON.stringify({ error: 'Election not found.' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Election deleted successfully.', election: deletedElection }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting election:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete election.' }),
      { status: 500 }
    );
  }
}

// PUT: Update a specific election by ID
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const { name, startTime, endTime, district, municipality } = await req.json();

    if (!id || !name || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id, name, startTime, endTime.' }),
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
  _id: { $ne: new mongoose.Types.ObjectId(id) },
  startTime: { $lt: new Date(endTime) },
  endTime: { $gt: new Date(startTime) },
});
    
    if (conflictingElection) {
      return new Response(
        JSON.stringify({
          error: `An election (${conflictingElection.name}) is already running during the requested time frame.`,
        }),
        { status: 400 }
      );
    }

    // Validate startTime and endTime
    const validStartTime = new Date(startTime).toISOString();
    const validEndTime = new Date(endTime).toISOString();

    // Update the election
    const updatedElection = await Election.findByIdAndUpdate(
      id,
      {
        name,
        startTime: validStartTime,
        endTime: validEndTime,
        ...(district ? { district } : {}),
        ...(municipality ? { municipality } : {}),
      },
      { new: true } // Return the updated document
    );

    if (!updatedElection) {
      return new Response(
        JSON.stringify({ error: 'Election not found.' }),
        { status: 404 }
      );
    }

    console.log('Updated election:', updatedElection);
    return new Response(JSON.stringify(updatedElection), { status: 200 });
  } catch (error) {
    console.error('Error updating election:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update election.' }),
      { status: 500 }
    );
  }
}
