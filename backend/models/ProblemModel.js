import mongoose from "mongoose";
import { problemSchema } from "./ProblemSchema.js";

//Creating models for fuel using problemSchema
export const Problem = mongoose.model("Problem", problemSchema);
