import { Request, Response } from 'express';
import transporter from '../../utils/emailTransporter';

export const sendEmail = async (req: Request, res: Response) => {
  const { email, subject, body, images } = req.body;

  const attachments = images.map((image: string, index: number) => ({
    filename: `image_${index}.jpg`,
    content: image.split(',')[1],
    encoding: 'base64',
  }));

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: body,
      attachments,
    });

    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};
