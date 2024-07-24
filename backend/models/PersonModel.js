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

      uppercase: true,
    },
    education: {
      type: String,
    },
    diploma: {
      type: Date,
    },
    major: {
      type: Date,
    },
    email: {
      type: String,

      uppercase: true,
    },
    phone: {
      type: Number,
    },
    phoneSecond: {
      type: Number,
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
