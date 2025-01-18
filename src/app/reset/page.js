'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage({ params }) {
  const { token } = params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/reset-password', { token, password });
      toast.success('Password reset successful');
      router.push('/login');
    } catch (error) {
      toast.error('Password reset failed');
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-8">
      <h1 className="text-center text-4xl mb-4">Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="w-full bg-primary text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
}








































































































