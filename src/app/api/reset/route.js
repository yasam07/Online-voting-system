import { User } from '../../../models/voter';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { token, password } = req.body;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).send('Invalid or expired token');

  // Update password
  user.password = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send('Password updated successfully');
}
