var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: "SubCategory Name required",
      minlength: [2, "Too short"],
      maxlength: [32, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    parent: { type: ObjectId, ref: "Category", required: "Category is required" }
  },
  {
    timestamps: true,
  }
);
var SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
