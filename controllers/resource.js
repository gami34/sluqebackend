const expressAsyncHandler = require("express-async-handler");
const SystemResource = require("../models/systemResourceModel");

exports.createSystemResource = expressAsyncHandler(async (req, res) => {
    // create role
    let newSystemResource = new SystemResource({
        name: req.body.name,
        slug: req.body.name,
        description: req.body.description,
    });
    newSystemResource.save((err) => {
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

exports.getSystemResource = expressAsyncHandler(async (req, res) => {
    // create role
    SystemResource.findOne({ _id: req.params.id }, (err, resource) => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true, resource })
    });
});

exports.getSystemResources = (async (req, res) => {
    // create role
    SystemResource.find({}).exec((err, resources) => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true, resources })
    });
});

exports.deleteSystemResource = expressAsyncHandler(async (req, res) => {
    // create role
    SystemResource.findOneAndRemove({ _id: req.params.id }, err => {
        if (err) return res.status(400).json({ success: false })
        return res.status(200).json({ success: true })
    });
});

exports.updateSystemResource = expressAsyncHandler(async (req, res) => {
    // find prev data
    SystemResource.findOne({ _id: req.params.id }, async (err, resource) => {
        if (err || resource == null) return res.status(400).json({ success: false })

        let updateParam = {
            name: req.body.name || resource.name,
            slug: req.body.name || resource.name,
            description: req.body.description || resource.description
        }
        if ("activated" in req.body) {
            updateParam.activated = await req.body.activated;
        }

        // udpate the record on the db
        SystemResource.findOneAndUpdate({ _id: req.params.id }, { $set: updateParam }, err => {
            if (err) return res.status(400).json({ success: false })
            return res.status(200).json({ success: true })
        })
    })
});