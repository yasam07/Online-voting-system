// models/Election.js
import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  electionId: {
    type: String,
    required: true,
    unique: true,
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
  district: {
    type: String,
    required: false,
  },
  municipality: {
    type: String,
    required: false,
  },
  disabledMunicipalities: { type: [String], default: [],required:false },
});

const Election = mongoose.models.Election || mongoose.model('Election', electionSchema);

export default Election;
