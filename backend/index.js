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
import siteRoutes from "./routes/siteRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import personRoutes from "./routes/personRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
const __dirname = path.resolve();
const { MONGO_URL, PORT } = process.env;
const app = express();
const upload = multer();
import bodyParser from "body-parser";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/images", express.static("images"));
// app.use(upload.array());
//MIDDLEWARES
//Middleware for handling CORS
app.use(cors());
//cookieparser middleware
app.use(cookieParser());
//Middleware for parsing request body
app.use(express.json());

//ROUTES

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sites", siteRoutes);
app.use("/logs", logRoutes);
app.use("/services", serviceRoutes);
app.use("/fuels", fuelRoutes);
app.use("/problems", problemRoutes);
app.use("/vehicle", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/cars", carRoutes);
app.use("/trucks", truckRoutes);
app.use("/api/person", personRoutes);

//set static folder
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

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
// app.use((err, res, req, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
//SERVER
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
