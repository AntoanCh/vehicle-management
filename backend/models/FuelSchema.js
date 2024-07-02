import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";

export const fuelSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
    invoice: {
      type: String,
      required: true,
    },
    km: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      // type: String,
      ref: "Vehicle",
    },
  },
  {
    timestamps: true,
  }
);
