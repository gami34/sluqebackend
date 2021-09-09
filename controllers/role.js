const expressAsyncHandler = require("express-async-handler");
const Role = require("../models/roleModel");
const { User } = require("../models/userModel");



exports.createRole = expressAsyncHandler(async (req, res) => {
    // create role
    console.log(req.body)
    let newRole = new Role({
        name: req.body.name,
        slug: req.body.name,
        description: req.body.description,
    });
    newRole.save((err) => {
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    err,
                });
        }
        res.status(200).json({ success: true, saved: true });
    });
    // send client, role info
});

exports.deleteRole = expressAsyncHandler(async (req, res) => {
    // create role
    Role.findOneAndRemove({ _id: req.params.id }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true })
    });
});

exports.getRole = expressAsyncHandler(async (req, res) => {
    // create role
    Role.findOne({ _id: req.params.id }, (err, role) => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true, role })
    });
});

exports.getRoles = expressAsyncHandler(async (req, res) => {
    // create role
    Role.find({}).populate("creator").exec((err, roles) => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true, roles })
    });
});

exports.updateRole = expressAsyncHandler(async (req, res) => {
    console.log(req.body)
    // find prev data
    Role.findOne({ _id: req.params.id }, (err, roleData) => {
        if (err || roleData == null) return res.status(400).json({ success: false })

        let updateParam = {
            name: req.body.name || roleData.name,
            slug: req.body.name || roleData.name,
            description: req.body.description || roleData.description
        }

        // udpate the record on the db
        Role.findOneAndUpdate({ _id: req.params.id }, { $set: updateParam }, err => {
            if (err) return res.status(400).json({ success: false })
            return res.status(200).json({ success: true })
        })
    })
});

