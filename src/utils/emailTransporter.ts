import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"), // ✅ Convert port to number
  secure: process.env.SMTP_SECURE === "true", // ✅ Use SSL if needed
  auth: {
    user: process.env.SMTP_USER, // ✅ Ensure values exist
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

export default transporter;
