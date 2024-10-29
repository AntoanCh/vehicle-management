import mongoose, { Schema } from "mongoose";
import { Record } from "./RecordModel.js";

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
    occupied: {
      type: Boolean,
      default: false,
      required: true,
    },
    recordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Record",
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for drivers using driverSchema
export const Driver = mongoose.model("Driver", driverSchema);
