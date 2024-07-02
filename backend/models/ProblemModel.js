import mongoose from "mongoose";
import { problemSchema } from "./ProblemSchema.js";

//Creating models for fuel using fuelSchema
export const Problem = mongoose.model("Problem", problemSchema);
