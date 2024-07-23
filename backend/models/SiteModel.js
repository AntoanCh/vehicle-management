import mongoose from "mongoose";
import mongoose, { Schema } from "mongoose";

export const siteSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    company: {
      type: String,
    },
    address: {
      type: String,
    },

    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for sites using siteSchema
export const Site = mongoose.model("Site", siteSchema);
