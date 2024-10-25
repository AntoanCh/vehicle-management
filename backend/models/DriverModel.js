import mongoose, { Schema } from "mongoose";

export const driverSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      uppercase: true,
    },
    lastName: {
      type: String,
      required: true,
      uppercase: true,
    },
    barcode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for drivers using driverSchema
export const Driver = mongoose.model("Driver", driverSchema);
