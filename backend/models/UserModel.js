import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username must be unique"],
    required: [true, "Username is required"],
    uppercase: true,
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// userSchema.pre("save", async function () {
//   this.password = await bcrypt.hash(this.password, 12);
// });

export const User = mongoose.model("User", userSchema);
