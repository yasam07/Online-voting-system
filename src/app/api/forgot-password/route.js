import { User } from '../../models/voter'; // Your voter model
import mongoose from 'mongoose';
import crypto from 'crypto';
import { sendOtpSms } from '../../../libs/sms'; // Utility to send OTP via SMS

export async function POST(req) {
  try {
    // Parse the request body
    const { nationalId, phoneNumber } = await req.json();

    if (!nationalId || !phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'National ID and Phone Number are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure MongoDB connection is established
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Check if user with the provided nationalId and phoneNumber exists
    const user = await User.findOne({ nationalId, phoneNumber });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No user found with the provided National ID and Phone Number' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store the OTP and expiration time in the user's document
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send the OTP to the user's phone number
    await sendOtpSms(phoneNumber, otp); // Utility function to send SMS

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent to your phone number' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in forgot-password API:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred, please try again' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

