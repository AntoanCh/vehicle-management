import mongoose, { Schema } from "mongoose";

export const configSchema = mongoose.Schema(
  {
    owners: [String],
    locations: [String],
    sites: [String],
    dateWarning1: {
      timeVal: String,
      value: Number,
    },
    dateWarning2: {
      timeVal: String,
      value: Number,
    },
    kmWarning1: {
      value: Number,
    },
    kmWarning1: {
      value: Number,
    },
    checkWarning: {
      timeVal: String,
      value: Number,
    },
    checkDuration: {
      timeVal: String,
      value: Number,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for sites using configSchema
export const Config = mongoose.model("Config", configSchema);
