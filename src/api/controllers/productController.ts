import { Request, Response } from 'express';
import Product from '../models/Product';

// Verify Product Authenticity
export const verifyProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ verified: false, message: 'Product not found or invalid QR.' });
    }

    return res.status(200).json({ verified: true, product });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ verified: false, message: 'Internal server error.' });
  }
};

// Create new Product (Admin use)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Creation error:', error);
    return res.status(500).json({ message: 'Error creating product.' });
  }
};

// Get All Products (Admin use)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
