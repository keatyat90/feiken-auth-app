import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Hardcoded Admin User (Ensure this runs once on app start)
const initializeAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD env variable');
    }

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      admin = new User({ 
        name: 'Admin', 
        email: adminEmail, 
        password: hashedPassword, 
        role: 'admin' 
      });
      await admin.save();
      console.log('Admin user initialized');
    }
  } catch (err) {
    console.error('Error initializing admin user:', err);
  }
};
initializeAdmin();

// Login User
export const loginCredential = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { id: user.id, role: user.role };

    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" }, (err, token) => {
      if (err || !token) {
        return res.status(500).json({ msg: "Error generating token" });
      }

      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export default router;
