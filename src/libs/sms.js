const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendOtpSms(phoneNumber, otp) {
  try {
    console.log('Attempting to send OTP...');
    console.log('OTP:', otp);
    console.log('Using Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER); // Using the env variable
    console.log('Phone Number:', phoneNumber);

    // Check if the phone number or OTP is undefined
    if (!phoneNumber || !otp) {
      throw new Error('Phone number or OTP is missing');
    }

    // Send the OTP using Twilio
    const response = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Use the Twilio phone number from env variable
      to: '+977 9869944707', // Dynamic phone number passed as an argument
    });

    console.log('Twilio Response:', response);
    console.log(`OTP successfully sent to ${phoneNumber}`);
    return response; // Return response for further use if needed
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    console.error('Error Details:', error.response?.data || error.message);
    throw new Error('Failed to send OTP SMS');
  }
}
