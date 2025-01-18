// /pages/api/reset-password.js

import { User } from '../../../models/voter'; // Your user model
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    try {
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URL);
      }

      const user = await User.findOne({ 'resetToken.token': token });

      if (!user) {
        return res.status(404).json({ error: 'Invalid or expired token' });
      }

      // Check token expiration
      const tokenExpiry = new Date(user.resetToken.expiry);
      if (tokenExpiry < new Date()) {
        return res.status(400).json({ error: 'Token has expired' });
      }

      // Update password
      user.password = bcrypt.hashSync(password, 10);
      user.resetToken = undefined; // Clear reset token
      await user.save();

      return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred, please try again' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
