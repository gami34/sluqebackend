var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var systemResourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: "Role title required",
            minlength: [3, "Role title too short"],
            maxlength: [255, "Role title too long"],
            text: true,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        activated: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            trim: true,
            required: "Role description required",
            minlength: [3, "Role description too short"],
            maxlength: [20000, "Role description too long"],
            text: true,
        }
    },
    {
        timestamps: true,
    }
);
const SystemResource = mongoose.model("SystemResource", systemResourceSchema);
module.exports = SystemResource
