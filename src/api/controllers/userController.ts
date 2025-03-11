import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Hardcoded Admin User (Ensure this runs once on app start)
const initializeAdmin = async () => {
  try {
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      admin = new User({ 
        name: 'Admin', 
        email: 'admin@example.com', 
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
    console.log("user:", user);

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

      console.log("✅ Token sent to client:", token); // Debug log
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export default router;
