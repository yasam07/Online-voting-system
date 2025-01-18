import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  district: { type: String, required: true },
  municipality: { type: String, required: true },
  mayorId: { type: String, required: true },
  deputyMayorId: { type: String, required: true },
  mayorParty: { type: String, required: true },
  deputyMayorParty: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema);
