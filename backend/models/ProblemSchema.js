import mongoose, { Schema } from "mongoose";
import { Vehicle } from "./VehicleModel.js";
import { Driver } from "./DriverModel.js";

export const problemSchema = mongoose.Schema(
  {
    date: {
      type: Date,
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
    driverName: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    doneByUser: {
      type: String,
    },
    doneDate: {
      type: Date,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  },
  {
    timestamps: true,
  }
);
