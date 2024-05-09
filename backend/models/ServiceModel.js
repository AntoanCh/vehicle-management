import mongoose from "mongoose";
import { serviceSchema } from "./ServiceSchema.js";

//Creating models for services using serviceSchema
export const Service = mongoose.model("Service", serviceSchema);
