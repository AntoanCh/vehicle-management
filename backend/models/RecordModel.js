import mongoose from "mongoose";
import { Vehicle } from "./VehicleModel.js";
import { Driver } from "./DriverModel.js";

export const recordSchema = mongoose.Schema(
  {
    pickupTime: {
      type: Date,
      required: true,
    },
    dropoffTime: {
      type: Date,
      required: false,
    },
    driverName: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: false,
    },
    problem: {
      type: String,
    },
    pickupKm: {
      type: Number,
      required: true,
    },
    dropoffKm: {
      type: Number,
      required: false,
    },
    vehicleReg: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
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

//Creating models for fuel using fuelSchema
export const Record = mongoose.model("Record", recordSchema);
