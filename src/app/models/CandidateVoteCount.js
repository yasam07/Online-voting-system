// models/CandidateVoteCount.js
import mongoose from 'mongoose';

const candidateVoteCountSchema = new mongoose.Schema({
  mayorId: { type: String, required: true },
  mayorVotes: { type: Number, required: true, default: 0 },
  deputyMayorId: { type: String, required: true },
  deputyMayorVotes: { type: Number, required: true, default: 0 },
  electionId: { type: String, required: true }
});

// Check if the model is already registered, if not, create it
const CandidateVoteCount = mongoose.models.CandidateVoteCount || mongoose.model('CandidateVoteCount', candidateVoteCountSchema);

export default CandidateVoteCount;
