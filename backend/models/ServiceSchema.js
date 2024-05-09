import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";

export const serviceSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    desc: {
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
