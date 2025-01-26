import mongoose from 'mongoose';
import Contact from '../../models/Contact'; // Correct path if necessary

// MongoDB connection URI (use environment variables for production)
const MONGO_URI = process.env.MONGO_URL;

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Database connection error');
  }
}

// POST request for submitting a contact message
export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  // Basic validation (optional)
  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: 'All fields are required.' }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Create a new contact form entry
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    // Save the entry to the database
    await newContact.save();

    // Send a success response
    return new Response(
      JSON.stringify({ success: 'Message sent successfully.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500 }
    );
  }
}

// GET request for retrieving contact messages
export async function GET(request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all contact messages from the database
    const messages = await Contact.find();

    // Send the messages in the response
    return new Response(
      JSON.stringify({ messages }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500 }
    );
  }
}

