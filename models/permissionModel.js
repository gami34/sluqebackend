var mongoose = require("mongoose");

var permissionSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: "Role name is required",
        },
        resource: {
            type: String,
        },
        action: {
            type: String,
            enum: ["create:any", 'read:any', 'update:any', 'delete:any', 'create:own', 'read:own', 'update:own', 'delete:own'],
            required: "Role action is required",
        },
        attributes: [{
            type: String,
            required: "Role description required"
        }]
    }
);
const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;
