import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

//flies
import connectDB from './configs/connectDB.js';
import userRoute from './routes/userRoutes.js';
import authRoute from './routes/authRoutes.js';
import notificationRoute from './routes/notificationRoutes.js'
import adminRoute from './routes/adminRoutes.js';

//configuration
dotenv.config();
connectDB();

const app=express();

// 🔧 Trust the Render proxy so rate-limiting & IP detection works
app.set('trust proxy', 1);

// 🛡️ Add security middlewares
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per IP
  message: 'Too many requests from this IP, try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

//middleware
app.use(
    cors({
      origin: '*', 
      credentials: true,
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());

// Sanity Check Route
app.get("/", (req, res) => {
    res.send("server is running fine");
  });

  app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/auth",authRoute);
app.use('/api/v1/notification', notificationRoute);
app.use("/api/v1/admin",adminRoute);



export default app;