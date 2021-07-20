var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "Brand Name required",
      minlength: [2, "Too short"],
      maxlength: [25, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: Object,
      required: "Brand image required",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
var Brand = mongoose.model("Brand", brandSchema);
export default Brand;
