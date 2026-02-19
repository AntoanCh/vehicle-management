import mongoose, { Schema } from "mongoose";

export const ownerSchema = mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

//Creating models for owners using ownerSchema
export const Owner = mongoose.model("Owner", ownerSchema);
