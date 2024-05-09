import mongoose from "mongoose";
import { vehicleSchema } from "./VehicleSchema.js";

//Creating models for Cars and Trucks using vehicleSchema
export const Car = mongoose.model("Car", vehicleSchema);
export const Truck = mongoose.model("Truck", vehicleSchema);
export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
