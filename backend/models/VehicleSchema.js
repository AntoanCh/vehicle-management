import mongoose, { Schema } from "mongoose";
import { Service } from "./ServiceModel.js";
import { Log } from "./LogModel.js";
import { Driver } from "./DriverModel.js";

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
      required: false,
      uppercase: true,
    },
    bodyNum: {
      type: String,
      required: true,
      uppercase: true,
    },
    talonNum: {
      type: String,
      required: false,
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
    kasko: {
      type: Boolean,
      required: true,
    },
    kaskoDate: {
      type: Date,
      required: false,
    },
    kaskoNum: {
      type: String,
      required: false,
      uppercase: false,
    },
    tax: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      required: true,
      uppercase: true,
    },
    cat: {
      type: String,
      required: false,
    },
    oil: {
      type: String,
      required: false,
    },
    tires: {
      type: String,
      required: false,
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
    vignette: {
      type: Boolean,
      required: true,
    },
    vignetteDate: {
      type: Date,
      required: false,
    },
    oilChange: {
      type: String,
      required: true,
    },
    issue: {
      type: Boolean,
      default: false,
    },
    availability: {
      status: {
        type: String,
        default: "",
      },
      user: {
        type: String,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
      },
      time: {
        type: Date,
      },
      reserved: {
        type: Boolean,
      },
    },
    sold: {
      type: Boolean,
      default: false,
    },
    soldPrice: {
      type: Number,
    },
    soldDate: {
      type: Date,
    },
    totalServiceCost: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.pre(`deleteMany`, (vehicle) => {
  Service.remove({ vehicleId: vehicle._id });
  Log.remove({ vehicleId: vehicle._id });
});
