import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  electionId: { type: String,  required: true }, // Reference to the Election model
  district: { type: String, required: true },
  municipality: { type: String, required: true },
  mayorCandidates: [
    {
      candidateId: { type: String, required: true },
      name: { type: String, required: true },
      party: { type: String, required: true },
    },
  ],
  deputyMayorCandidates: [
    {
      candidateId: { type: String, required: true },
      name: { type: String, required: true },
      party: { type: String, required: true },
    },
  ],
});

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
export default Candidate;
