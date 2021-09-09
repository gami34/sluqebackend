const expressAsyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");

exports.getPermissionByResource = expressAsyncHandler(async (req, res) => {
    Permission.find({ role: req.params.role, resource: req.params.resource }, async (err, permissionList) => {
        console.log(permissionList, "permission");
        let actionList = []
        await permissionList.forEach(async (element) => {
            await actionList.push(element.action);
        });
        if (err) return res.status(400).json({ success: false });
        return res.status(200).json({ success: true, permissionList, actionList });
    });
})

exports.createPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible
    // first check if this role resource information already exist in the db
    let newPermission = new Permission({
        role: req.body.role,
        resource: req.body.resource,
        action: req.body.action,
        attributes: ['*']
    });
    newPermission.save(err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
})
exports.createCreateAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "create:any",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "create:any" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createCreateOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "create:own",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "create:own" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createReadAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "read:any",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "read:any" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createReadOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "read:own",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "read:own" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createUpdateOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "update:own",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "update:own" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createUpdateAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "update:any",
        attributes: ['*'],
    };
    Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: "update:any" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createDeleteOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "delete:own",
        attributes: ['*'],
    };
    Permission.findOneAnddelete({ role: req.body.role, resource: req.body.resource, action: "delete:own" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.createDeleteAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    let newPermission = {
        role: req.body.role,
        resource: req.body.resource,
        action: "delete:any",
        attributes: ['*'],
    };
    Permission.findOneAnddelete({ role: req.body.role, resource: req.body.resource, action: "delete:any" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});

/** READ THE PERMISSION RECORD */
exports.readPermissions = expressAsyncHandler(async (req, res) => {
    //first find if the
    Permission.find({ role: req.body.role }, (err, permissions) => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true, permissions });
    })
    // send client, role info
});

exports.deleteCreateAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db

    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "create:any" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteCreateOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible


    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "create:own" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteReadAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "read:any" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteReadOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "read:own" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteUpdateOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "update:own" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteUpdateAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "update:any" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteDeleteOwnPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db

    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "delete:own" }, { $set: newPermission }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});
exports.deleteDeleteAnyPermission = expressAsyncHandler(async (req, res) => {
    // check if the user has permission to create Permission :: fetch the role name with the user's role objectID
    // get the name of the role
    // run a loop and generate an array of objects containing the list of actions to work on with possible

    // first check if this role resource information already exist in the db
    Permission.findOneAndRemove({ role: req.body.role, resource: req.body.resource, action: "delete:any" }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true });
    })
    // send client, role info
});

/** ATTRIBUTE MANAGEMENT SYSTEM */
exports.allowAttributePermission = expressAsyncHandler(async () => {

    // First. get the list of attribute for this resource permission
    Permission.findOne({ role: req.body.role, resource: req.body.resource, action: req.body.action }, (err, permission) => {
        if (err) return res.status(400).json({ success: false });
        // Second: check if the attribute was earlier negated on the list of permission attribute, relove
        if ("!" + req.body.attribute in permission.attributes) {
            Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: req.body.action }, {
                $pull: {
                    attributes: "!" + req.body.attribute
                }
            }, err => {
                if (err) return res.status(400).json({ success: false });
                return res.status(200).json({ success: true })
            })
        } else {
            return res.status(200).json({ success: true })
        }
    })
})
exports.denyAttributePermission = expressAsyncHandler(async () => {

    // First. get the list of attribute for this resource permission
    Permission.findOne({ role: req.body.role, resource: req.body.resource, action: req.body.action }, (err, permission) => {
        if (err) return res.status(400).json({ success: false });
        // Second: check if the attribute was earlier negated on the list of permission attribute, relove
        if ("!" + req.body.attribute in permission.attributes) {
            return res.status(400).json({ sucess: true })
        } else {
            Permission.findOneAndUpdate({ role: req.body.role, resource: req.body.resource, action: req.body.action }, {
                $push: {
                    attributes: "!" + req.body.attribute
                }
            }, err => {
                if (err) return res.status(400).json({ success: false });
                return res.status(200).json({ success: true })
            })
        }
    })
})