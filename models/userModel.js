var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema(
  {
    // pseudo: { type: String, minlength: 5, maxlength: 15, unique: true },
    sex: { type: String, default: "Male" },
    email: { type: String, index: true, unique: true },
    role: { type: String, default: "customer" }, // ["vendor", "customer", "admin"]
    provider: { type: String },
    cart: { type: Array, default: [] },
    googleId: { type: String, default: "" },
    agreement: { type: Boolean, default: false },
    email_validated: { type: Boolean, default: false }, // needs to send an OTP question
    lastOTP: { type: String },

    // wishlist: [{ type: ObjectId, ref: "Product" }],
    //measurement parameters
    //acount info
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User", userSchema);
