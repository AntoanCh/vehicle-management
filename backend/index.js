import express from "express";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import carRoutes from "./routes/carRoutes.js";
import truckRoutes from "./routes/truckRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
// import bodyParser from "body-parser";

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS
app.use(cors());

app.get("/", (req, res) => {
  return res.status(234).send("Welcome");
});

app.use("/services", serviceRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/cars", carRoutes);
app.use("/trucks", truckRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/VehMan")
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
