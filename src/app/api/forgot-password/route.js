import { User } from '../../models/voter';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { sendOtpEmail } from '../../../libs/sms';

export async function POST(req) {
  try {
    const { nationalId, email } = await req.json();

    if (!nationalId || !email) {
      return new Response(
        JSON.stringify({ error: 'National ID and Email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ensure MongoDB connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Find the user and include hidden fields
    const user = await User.findOne({ nationalId, email }).select(
      '+resetOtp +resetOtpExpires'
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'No user found with the provided National ID and Email' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate OTP and hash it
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Set OTP and expiration fields
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save the user
    try {
      await user.save();
    } catch (error) {
      console.error('Error saving user:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save OTP, please try again' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return new Response(
      JSON.stringify({ success: true, message: 'OTP sent to your email address' }),
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
