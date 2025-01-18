// models/CandidateVoteCount.js
import mongoose from 'mongoose';

const CandidateVoteCountSchema = new mongoose.Schema({
  mayorId: {
    type: String,
    required: true,
  },
  mayorVotes: {
    type: Number,
    default: 0,
  },
  deputyMayorId: {
    type: String,
    required: true,
  },
  deputyMayorVotes: {
    type: Number,
    default: 0,
  },
});

const CandidateVoteCount = mongoose.models.CandidateVoteCount || mongoose.model('CandidateVoteCount', CandidateVoteCountSchema);

export default CandidateVoteCount;
