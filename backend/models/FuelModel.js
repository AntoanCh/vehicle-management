import mongoose from "mongoose";
import { fuelSchema } from "./FuelSchema.js";

//Creating models for fuel using fuelSchema
export const Fuel = mongoose.model("Fuel", fuelSchema);
