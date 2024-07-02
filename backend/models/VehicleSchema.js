import mongoose, { Schema } from "mongoose";
import { Service } from "./ServiceModel.js";

export const vehicleSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: true,
      uppercase: true,
    },
    reg: {
      type: String,
      required: true,
      uppercase: true,
    },
    year: {
      type: String,
      required: true,
    },
    km: {
      type: String,
      required: true,
    },
    fuel: {
      type: String,
      required: true,
    },
    engNum: {
      type: String,
      required: true,
      uppercase: true,
    },
    bodyNum: {
      type: String,
      required: true,
      uppercase: true,
    },
    talonNum: {
      type: String,
      required: true,
    },
    gtp: {
      type: Date,
      required: true,
    },
    insDate: {
      type: Date,
      required: true,
    },
    insNum: {
      type: String,
      required: false,
      uppercase: true,
    },
    kaskoDate: {
      type: Date,
      required: false,
    },
    kaskoNum: {
      type: String,
      required: false,
      uppercase: true,
    },
    tax: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      uppercase: true,
    },
    cat: {
      type: String,
      required: true,
    },
    oil: {
      type: String,
      required: true,
    },
    tires: {
      type: String,
      required: true,
    },
    checked: {
      type: Date,
      required: false,
    },
    purchaseDate: {
      type: Date,
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    startKm: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    // services: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     // type: String,
    //     ref: "Service",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);
