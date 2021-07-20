var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: "Product title required",
      minlength: [3, "Product title too short"],
      maxlength: [255, "Product title too long"],
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: "Product description required",
      minlength: [3, "Product description too short"],
      maxlength: [20000, "Product description too long"],
      text: true,
    },
    price: {
      type: Number,
      trim: true,
      required: "Product price required",
      maxlength: 32,
    },
    discountPrice: {
      type: Number,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: "Category is required",
    },
    subcategories: [
      {
        type: ObjectId,
        ref: "SubCategory",
        required: "SubCategory is required",
      },
    ],
    quantity: {
      type: Number,
      trim: true,
      required: "Product quantity required",
    },
    sold: {
      type: Number,
      trim: true,
      default: 0,
    },
    coverImage: {
      type: Object,
      trim: true,
    },
    images: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      trim: true,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    colors: [
      {
        type: String,
        enum: ["Black", "Brown", "Silver", "White", "Blue"],
      },
    ],
    brand: {
      type: ObjectId,
      ref: "Brand",
      required: "Product brand required",
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);
var Product = mongoose.model("Product", productSchema);
export default Product;
