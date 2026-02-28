import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import inquiryRouter from "./routes/inquiryRoute.js";
import watchBuyRoute from "./routes/watchBuyRoute.js";

/* -------------------------------------------------------------------------- */
/* 🔹 ENV SETUP */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/* 🔹 APP INIT */
/* -------------------------------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/* 🔹 CONNECT SERVICES */
/* -------------------------------------------------------------------------- */
connectDB();
connectCloudinary();

/* -------------------------------------------------------------------------- */
/* 🔹 ALLOWED ORIGINS (LIVE + LOCAL) */
/* -------------------------------------------------------------------------- */
const allowedOrigins = [
  "https://viveratex.com",
  "https://www.viveratex.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5174",

];

/* -------------------------------------------------------------------------- */
/* 🔹 CORS CONFIG (PRODUCTION SAFE) */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/* 🔹 BODY PARSER */
/* -------------------------------------------------------------------------- */
app.use(express.json({ limit: "10mb" }));

/* -------------------------------------------------------------------------- */
/* 🔹 HEALTH CHECK (VERY IMPORTANT FOR LIVE) */
/* -------------------------------------------------------------------------- */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* -------------------------------------------------------------------------- */
/* 🔹 API ROUTES */
/* -------------------------------------------------------------------------- */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/watch-buy", watchBuyRoute);

/* -------------------------------------------------------------------------- */
/* 🔹 ROOT */
/* -------------------------------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("API Working (Live)");
});

/* -------------------------------------------------------------------------- */
/* 🔹 START SERVER */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Live server running on port ${PORT}`);
});
