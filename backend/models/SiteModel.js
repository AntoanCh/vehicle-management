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
      type: String,
    },
    password: {
      type: String,
      default: "",
    },
    hasVehicles: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

//Creating models for sites using siteSchema
export const Site = mongoose.model("Site", siteSchema);
