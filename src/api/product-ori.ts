import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API endpoint to verify product by ID
app.get('/api/products/verify/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const result = await pool.query('SELECT id FROM products WHERE id = $1', [productId]) as any;

    if (result.rowCount > 0) {
      res.json({ exists: true, message: 'Product is genuine.' });
    } else {
      res.json({ exists: false, message: 'Product not found or inconclusive.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ exists: false, message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});