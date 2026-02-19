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
      type: String,
      required: true,
    },
    barcode2: {
      type: String,
    },
    occupied: {
      type: Boolean,
      default: false,
      required: true,
    },
    itemTransport: {
     status: {
        type: Boolean,
        default: false,
      },
       locations: {
        type: [String],     //  Array of strings
        default: [],         // Optional: start as an empty array
      },
    },
    licenseNum: {
      type: String,
    },
    licenseExp: { type: Date },
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
