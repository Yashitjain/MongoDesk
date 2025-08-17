const Groq = require("groq-sdk");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const groq = new Groq({ apiKey: process.env.api_key }); // Initialize Groq with API key from environment variables
const cors = require('cors');
const nodemailer = require('nodemailer');

const response = async (prompt, content) => {
  const result = await groq.chat.completions.create({
    model: "moonshotai/kimi-k2-instruct",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: content },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "general_output",
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            details: { type: "string" }
          },
          required: ["summary"],
          additionalProperties: true
        }
      }
    }
  });
  return result;
}


const sendMail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yashitvictus2022@gmail.com',
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: 'youremail@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { response, sendMail };