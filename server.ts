require('dotenv').config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Allow large image uploads

// Configure SMTP with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail
    pass: process.env.GMAIL_PASS, // Your App Password from Google
  },
  logger: true,  // ✅ Logs email activity
  debug: true,
});

// **✅ Add TypeScript Types for Express Request & Response**
app.post('/send-email', async (req: Request, res: Response) => {
  const { email, subject, body, images }: { email: string; subject: string; body: string; images: string[] } = req.body;

  // **✅ Add TypeScript Types for map()**
  const attachments = images.map((image: string, index: number) => ({
    filename: `image_${index}.jpg`,
    content: image.split(',')[1], // Remove "data:image/jpeg;base64,"
    encoding: 'base64',
  }));

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: body,
    attachments: attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
