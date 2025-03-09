import { Request, Response } from "express";
import transporter from "../../utils/emailTransporter";

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { email, subject, body, images } = req.body;

    if (!email || !subject || !body || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    console.log("📧 Sending email to:", email);

    const attachments = images.map((image: string, index: number) => ({
      filename: `image_${index}.jpg`,
      content: image.split(',')[1], // Extract Base64 content
      encoding: "base64",
    }));

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: body,
      attachments: attachments,
    };

    console.log("📨 Sending email with attachments:", attachments.length);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};
