import mongoose, { Schema } from "mongoose";

export const fuelSchema = mongoose.Schema(
  {
    fuel: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

//Creating models for owners using fuelSchema
export const Fuel = mongoose.model("FUel", fuelSchema);
