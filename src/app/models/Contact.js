import mongoose from 'mongoose';

// Define the schema for the contact form submission
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create a model from the schema
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
