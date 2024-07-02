import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import carRoutes from "./routes/carRoutes.js";
import truckRoutes from "./routes/truckRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
const { MONGO_URL, PORT } = process.env;
const app = express();
// import bodyParser from "body-parser";

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//MIDDLEWARES
//Middleware for handling CORS
app.use(cors());
//cookieparser middleware
app.use(cookieParser());
//Middleware for parsing request body
app.use(express.json());

//ROUTES
app.get("/", (req, res) => {
  return res.status(234).send("Welcome");
});
app.use("/", authRoutes);
app.use("/services", serviceRoutes);
app.use("/fuels", fuelRoutes);
app.use("/problems", problemRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/cars", carRoutes);
app.use("/trucks", truckRoutes);

//MONGODB CONNECTION
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("App connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB:", err);
  });

//GLOBAL ERROR HANDLER
app.use((err, res, req, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
//SERVER
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
