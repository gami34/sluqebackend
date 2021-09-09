var express = require("express");
const { createSystemResource, getSystemResources, getSystemResource, updateSystemResource, deleteSystemResource } = require("../controllers/resource");
const { validateSystemResourceData, errorCatcher } = require("../middlewares/validInfoChecker");
var router = express.Router();

// create role
router.post("/create", validateSystemResourceData, errorCatcher, createSystemResource);
// read role
router.get("/", getSystemResources);
router.get("/:id", getSystemResource);
// update role
router.post("/update/:id", updateSystemResource);
// delete role
router.delete("/delete/:id", deleteSystemResource);

module.exports = router;