import mongoose from "mongoose";

export function connect() {
  // Check if the MongoDB URI is defined
  if (!process.env.MONGO_URL) {
    console.log("MONGO_URL is not defined in the environment variables.");
    return;
  }

  mongoose
    .connect(process.env.MONGO_URL, {
      tls: true,
      ssl: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("The DB error is:", err);
    });
}
