import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Account", accountSchema);