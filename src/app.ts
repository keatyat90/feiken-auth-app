import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";

import productRoutes from "./api/routes/productRoutes";
import emailRoutes from "./api/routes/emailRoutes";
// import qrRoutes from "./api/routes/qrRoutes";
import userRoutes from "./api/routes/userRoutes";
import authMiddleware from "./api/controllers/authMiddleware";

dotenv.config();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "" ,
  "http://localhost:5001", // Allow local API calls
  "http://192.168.0.104:5001", // Replace with your actual IP
  "exp://192.168.0.104:19000", // Expo Local Network
  "*", // Allow all origins for testing
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Security Middleware
app.use(helmet());

// ✅ Express Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Session & Passport Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false, // ✅ Improved security
  })
);
app.use(passport.initialize());
app.use(passport.session());

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!, {
    dbName: process.env.DB_NAME,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ API Routes
// app.use("/api/send-email", emailRoutes);
// app.use("/api/qrcodes", qrRoutes);
// app.use("/api/products", authMiddleware, productRoutes); // ✅ Protected
app.use("/api/products", productRoutes); // ✅ Protected
app.use("/api/users", userRoutes); // ✅ Public access to login/register

// ✅ Ensure Login is Public
app.post("/api/users/login", userRoutes);

// ✅ Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" });
});

// ✅ Catch All Undefined Routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// ✅ Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// ✅ Graceful Shutdown for MongoDB
process.on("SIGINT", () => {
  mongoose.connection.close(false).then(() => {
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
