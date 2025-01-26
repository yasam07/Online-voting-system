'use client';
import { useEffect, useState } from 'react';

const ViewMessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from API on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="text-white text-lg font-semibold animate-pulse">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-red-600">Error</h1>
          <p className="text-gray-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full m-5 max-w-3xl p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-center mb-6">
          Contact Messages
        </h1>
        
        {messages.length === 0 ? (
          <div className="text-center text-gray-700">No messages found.</div>
        ) : (
          <div className="space-y-8">
            {messages.map((message, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-purple-600">   Subject: {message.subject}</h2>
                  <div className="text-gray-600">
                    <span className="font-semibold">Full Name: </span>{message.name}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold">Email: </span>{message.email}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Message: </span>{message.message}
                  </p>
                </div>

                <div className="flex justify-between mt-6">
                  <span className="text-sm text-gray-500">Sent: {new Date(message.createdAt).toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Last updated: {new Date(message.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMessagePage;
