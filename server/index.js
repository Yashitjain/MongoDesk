// Import necessary modules
const Groq = require("groq-sdk");
const cors = require('cors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const groq = new Groq({ apiKey: process.env.api_key }); // Initialize Groq with API key from environment variables
const app = express(); // Set up an Express server to serve static files
const PORT = process.env.PORT || 8000;
const {response, sendMail} = require('./controller'); // Import the controller function

// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define a route to handle the chat completion request
app.post('/api/chat', async (req, res) => {
  console.log("Received request:", req.body); // Log the request body for debugging
  const { prompt, content } = req.body; // Get prompt and content from body
  try {
    const result = await response(prompt, content); // Call the response function from controller
    res.json(result.choices[0].message.content); // Send the result back as JSON
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
})

app.post('/api/sendMail', async (req, res) => {
  const { to, subject, text } = req.body; // Get email details from body
  try {
    await sendMail(to, subject, text); // Call the sendMail function from controller
    res.json({ message: "Email sent successfully!" }); // Send success response
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "An error occurred while sending the email." });
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});