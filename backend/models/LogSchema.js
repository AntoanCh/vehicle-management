import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";

export const logSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    user: {
      type: String,
      required: true,
    },
    changed: {
      type: String,
      required: false,
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
