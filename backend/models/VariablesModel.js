import mongoose, { Schema } from "mongoose";

export const variablesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for sites using variableSchema
export const Variable = mongoose.model("Variable", variablesSchema);
