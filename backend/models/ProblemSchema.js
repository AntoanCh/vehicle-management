import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";

export const problemSchema = mongoose.Schema(
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
