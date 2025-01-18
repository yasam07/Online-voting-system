import mongoose from 'mongoose';

const { model, models, Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: { // Replacing email with phoneNumber
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    municipality: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);
