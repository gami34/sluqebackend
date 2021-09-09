var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var backendUserSchema = new mongoose.Schema(
    {
        // pseudo: { type: String, minlength: 5, maxlength: 15, unique: true },
        sex: { type: String, default: "male" },
        firstName: { type: String, default: "brandcery" },
        lastName: { type: String, default: "brandcery" },
        department: { type: String },
        email: { type: String, index: true, unique: true },
        role: { type: ObjectId, ref: "Role" },
        agreement: { type: Boolean, default: false },
        email_validated: { type: Boolean, default: false }, // needs to send an OTP question
        lastOTP: { type: String },
        otpRequests: { type: Number, default: 0 },
        otp_created_at: { type: Date },
    },
    {
        timestamps: true,
    }
);
backendUserSchema.plugin(passportLocalMongoose);

exports.BackendUser = mongoose.model("backendUser", backendUserSchema);
