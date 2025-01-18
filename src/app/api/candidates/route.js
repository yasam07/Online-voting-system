import Candidate from '../../models/Candidate';
import mongoose from 'mongoose';


const connectMongo = async () => {
  if (mongoose.connections[0].readyState) 
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 30000, 
  });
};


export async function GET(req) {
  await connectMongo(); 

  try {
    const candidates = await Candidate.find();
    return new Response(JSON.stringify(candidates), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch candidates' }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const { district, municipality, mayorCandidates, deputyMayorCandidates } = await req.json();

    if (
      !district || 
      !municipality || 
      !mayorCandidates || 
      !deputyMayorCandidates || 
      mayorCandidates.some((c) => !c.name || !c.candidateId || !c.party) ||
      deputyMayorCandidates.some((c) => !c.name || !c.candidateId || !c.party)
    ) {
      return new Response(JSON.stringify({ message: 'All fields are required for candidates' }), { status: 400 });
    }

    const existingCandidates = await Candidate.findOne({ district, municipality });

    if (existingCandidates) {

      const existingMayorParties = existingCandidates.mayorCandidates.map(c => c.party);
      const existingDeputyMayorParties = existingCandidates.deputyMayorCandidates.map(c => c.party);


      const mayorParties = mayorCandidates.map(c => c.party);
      const duplicateMayorParties = mayorParties.filter(party => existingMayorParties.includes(party));

      if (duplicateMayorParties.length > 0) {
        return new Response(
          JSON.stringify({ message: `Party '${duplicateMayorParties[0]}' already has a candidate for mayor in ${municipality}.` }),
          { status: 400 }
        );
      }


      const deputyMayorParties = deputyMayorCandidates.map(c => c.party);
      const duplicateDeputyMayorParties = deputyMayorParties.filter(party => existingDeputyMayorParties.includes(party));

      if (duplicateDeputyMayorParties.length > 0) {
        return new Response(
          JSON.stringify({ message: `Party '${duplicateDeputyMayorParties[0]}' already has a candidate for deputy mayor in ${municipality}.` }),
          { status: 400 }
        );
      }


      const conflictingMayorParties = mayorParties.filter(party => mayorCandidates.filter(c => c.party === party).length > 1);
      if (conflictingMayorParties.length > 0) {
        return new Response(
          JSON.stringify({ message: `Party '${conflictingMayorParties[0]}' cannot have multiple candidates for mayor.` }),
          { status: 400 }
        );
      }

      const conflictingDeputyMayorParties = deputyMayorParties.filter(party => deputyMayorCandidates.filter(c => c.party === party).length > 1);
      if (conflictingDeputyMayorParties.length > 0) {
        return new Response(
          JSON.stringify({ message: `Party '${conflictingDeputyMayorParties[0]}' cannot have multiple candidates for deputy mayor.` }),
          { status: 400 }
        );
      }
    }

    const newCandidate = new Candidate({
      district,
      municipality,
      mayorCandidates,
      deputyMayorCandidates,
    });

    await newCandidate.save();

    return new Response(JSON.stringify({ message: 'Candidates created successfully!' }), { status: 201 });
  } catch (error) {
    console.error('Error creating candidates:', error);
    return new Response(JSON.stringify({ message: 'Failed to create candidates' }), { status: 500 });
  }
}

export async function DELETE(req) {
  await connectMongo();

  const { district, municipality, postType, candidateIndex } = await req.json();

  if (!district || !municipality || !postType || candidateIndex === undefined) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields' }),
      { status: 400 }
    );
  }

  try {
    const candidate = await Candidate.findOne({ district, municipality });

    if (!candidate) {
      return new Response(
        JSON.stringify({ message: 'Candidate not found' }),
        { status: 404 }
      );
    }

    if (postType === 'mayorCandidates') {
      candidate.mayorCandidates.splice(candidateIndex, 1);
    } else if (postType === 'deputyMayorCandidates') {
      candidate.deputyMayorCandidates.splice(candidateIndex, 1);
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid post type' }),
        { status: 400 }
      );
    }

    await candidate.save();
    return new Response(
      JSON.stringify({ message: 'Candidate removed successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing candidate:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to remove candidate' }),
      { status: 500 }
    );
  }
}
