import mongoose from "mongoose";

const connectDB = async () => {
  let attempts = 0;
  const maxAttempts = 5;

  const tryConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority',
      });
      console.log(`✅ MongoDB connected`);
    } catch (error) {
      attempts++;
      console.error(`❌ MongoDB connection failed (${attempts}/${maxAttempts}): ${error.message}`);
      if (attempts < maxAttempts) {
        setTimeout(tryConnect, 5000);
      } else {
        console.error("❌ Max retries reached. Exiting...");
        process.exit(1);
      }
    }
  };

  await tryConnect();
};

export default connectDB;
