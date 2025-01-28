import { User } from '../../models/voter';
import mongoose from 'mongoose';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: 'Identifier and OTP are required' }),
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

    // Find the user by email or phone
    const user = await User.findOne({ email}).select(
      '+resetOtp +resetOtpExpires'
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the provided OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Check if OTP matches and is not expired
    if (
      user.resetOtp !== hashedOtp ||
      user.resetOtpExpires < Date.now()
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clear the OTP fields after successful verification
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: 'OTP verified successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-otp API:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred, please try again' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
