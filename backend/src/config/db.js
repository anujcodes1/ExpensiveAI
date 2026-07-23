import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.warn("[MongoDB] Disconnected. Attempting to reconnect...");
      connectDB();
    });

    mongoose.connection.on("error", (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
    });
  } catch (err) {
    console.error(`[MongoDB] Connection failed: ${err.message}`);
    if (retryCount < MAX_RETRIES) {
      const nextAttempt = retryCount + 1;
      console.log(`[MongoDB] Retrying (${nextAttempt}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s...`);
      setTimeout(() => connectDB(nextAttempt), RETRY_DELAY_MS);
    } else {
      console.error("[MongoDB] Max retries reached. Exiting process.");
      process.exit(1);
    }
  }
};

export default connectDB;
