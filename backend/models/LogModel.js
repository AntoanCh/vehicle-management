import mongoose from "mongoose";
import { logSchema } from "./LogSchema.js";

//Creating models for Logs using LogSchema
export const Log = mongoose.model("Log", logSchema);
