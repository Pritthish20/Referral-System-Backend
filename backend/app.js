import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from "cors";

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

//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/auth",authRoute);
app.use('/api/v1/notification', notificationRoute);
app.use("/api/v1/admin",adminRoute);



export default app;