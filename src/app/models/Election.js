import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  electionId: {
    type: String,
    required: true,
    unique: true, // Ensures that electionId is unique
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

// Use existing model if already defined, otherwise create a new one
const Election = mongoose.models.Election || mongoose.model('Election', electionSchema);

export default Election;
