const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like 'Outlook', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address from the environment variable
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

/**
 * Sends an OTP email to the user
 * @param {string} email - The recipient's email address
 * @param {string} otp - The OTP code to be sent
 * @returns {Promise<void>}
 */
export async function sendOtpEmail(email, otp) {
  console.log('recive email:',email)
console.log('sending email:',process.env.EMAIL_USER)
  try {
    console.log('Attempting to send OTP email...');
    console.log('OTP:', otp);
    console.log('Recipient Email:', email);

    // Check if the email or OTP is undefined
    if (!email || !otp) {
      throw new Error('Email or OTP is missing');
    }

    // Construct the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP for Verification',
      html: `
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <p>Thank you,</p>
        <p>Your Application Team</p>
      `,
    };

    // Send the email
    const response = await transporter.sendMail(mailOptions);

    console.log('Nodemailer Response:', response);
    console.log(`OTP successfully sent to ${email}`);
    return response; // Return response for further use if needed
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}
