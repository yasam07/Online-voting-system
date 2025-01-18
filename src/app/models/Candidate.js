import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  district: { type: String, required: true },
  municipality: { type: String, required: true },
  mayorCandidates: [{ 
    candidateId: String, 
    name: String, 
    party: String 
  }],
  deputyMayorCandidates: [{ 
    candidateId: String, 
    name: String, 
    party: String 
  }],
});

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;
