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
    IDNum: {
      type: Number,
    },
    EGN: {
      type: Number,
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
      type: Boolean,
    },
    education: {
      type: String,
    },
    diploma: {
      type: String,
    },
    major: {
      type: String,
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
    children: {
      type: String,
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
