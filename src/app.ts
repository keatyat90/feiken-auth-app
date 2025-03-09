import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import productRoutes from './api/routes/productRoutes';
import emailRoutes from './api/routes/emailRoutes';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!, {
  dbName: process.env.DB_NAME || 'your_db_name',
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

app.use(bodyParser.json({ limit: '10mb' })); 

// API Routes
app.use('/api/products', productRoutes);
app.use("/api/send-email", emailRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Backend service running ✅' });
});

// Health Check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
});

// Graceful Shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(false).then(() => {
    console.log('MongoDB disconnected on app termination');
    process.exit(0);
  });
});

// Server Initialization
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});