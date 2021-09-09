var mongoose = require("mongoose");
var { ObjectId } = mongoose.Schema;

var roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: "Role title required",
        },
        slug: {
            type: String,
            unique: true,
        },
        creator: {
            type: ObjectId,
            ref: "backendUser"
        },
        description: {
            type: String,
            required: "Role description required",
        }
    },
    {
        timestamps: true,
    }
);
const Role = mongoose.model("Role", roleSchema);
module.exports = Role
