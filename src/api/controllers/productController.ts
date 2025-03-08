import { Request, Response } from 'express';
import pool from '../../config/db';

export const verifyProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const result = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);

    if ((result.rowCount ?? 0) > 0) {
      res.json({ exists: true, message: 'Product is genuine.' });
    } else {
      res.json({ exists: false, message: 'Product not found or inconclusive.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ exists: false, message: 'Internal server error.' });
  }
};
