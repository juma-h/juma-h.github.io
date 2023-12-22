const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Load environment variables from .env
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML file with the form
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../../index.html');
  res.sendFile(indexPath);
});

// OAuth2 configuration
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

// Generate a URL for the user to authorize the app
const scopes = ['https://www.googleapis.com/auth/gmail.send'];
const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});


// Redirect the user to authorize the app
console.log('Authorize this app by visiting:', authorizeUrl);

// Handle form submission
// Handle form submission
app.post('/submit', async (req, res) => {
    try {
      const { name, email, subject, message, authorizationCode } = req.body;
  
      // Exchange the authorization code for tokens
      const { tokens } = await oAuth2Client.getToken(authorizationCode);
  
      // Update the OAuth2Client with the obtained tokens
      oAuth2Client.setCredentials(tokens);
  
      // Use nodemailer to send an email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'mitchfibi@gmail.com',
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: tokens.refresh_token,
          accessToken: tokens.access_token,
        },
      });
  
      const mailOptions = {
        from: email,
        to: 'jumamichelle95@gmail.com',
        subject: 'New form submission',
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent:', info.response);
      res.send('Form submitted successfully!'); // Provide feedback to the user
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
