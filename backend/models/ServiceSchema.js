import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";

export const serviceSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    invoice: {
      type: String,
      required: false,
    },
    km: {
      type: Number,
      required: false,
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
