import mongoose, { Schema } from "mongoose";

export const personSchema = mongoose.Schema(
  {
    site: {
      type: String,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: true,
      uppercase: true,
    },
    middleName: {
      type: String,
      required: true,
      uppercase: true,
    },
    lastName: {
      type: String,
      required: true,
      uppercase: true,
    },
    EGN: {
      type: String,
      required: true,
      uppercase: true,
    },
    addressOfficial: {
      type: String,
    },
    addressReal: {
      type: String,
    },
    job: {
      type: String,
      required: true,
      uppercase: true,
    },
    marital: {
      type: String,
    },
    telk: {
      type: String,
      required: true,
      uppercase: true,
    },
    education: {
      type: String,
      required: true,
    },
    diploma: {
      type: Date,
      required: true,
    },
    major: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: false,
      uppercase: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    phoneSecond: {
      type: Number,
      required: true,
    },
    emplymentDate: {
      type: Date,
      required: false,
      uppercase: false,
    },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
    },
  },
  {
    timestamps: true,
  }
);

//Creating models for services using personSchema
export const Person = mongoose.model("Person", personSchema);
