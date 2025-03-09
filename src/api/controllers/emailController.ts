import { Request, Response } from "express";
import transporter from "../../utils/emailTransporter";

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { email, subject, body, images } = req.body;

    if (!email || !subject || !body || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    console.log("📧 Sending email to:", email);

    // Attach images using URLs
    const attachments = images.map((imageUrl: string, index: number) => ({
      filename: `image_${index}.jpg`,
      path: imageUrl, // Direct URL attachment
    }));

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: body,
      attachments: attachments, // Image URLs as attachments
    };

    console.log("📨 Sending email with image URLs:", attachments.length);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
