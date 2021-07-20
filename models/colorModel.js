var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "Color Name required",
      minlength: [2, "Too short"],
      maxlength: [15, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: "Color Code required",
    },
  },
  {
    timestamps: true,
  }
);
const Color = mongoose.model("Color", colorSchema);
export default Color;
