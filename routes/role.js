var express = require("express");
const { createRole, deleteRole, updateRole, getRoles, getRole } = require("../controllers/role");
const { validateRoleData, errorCatcher } = require("../middlewares/validInfoChecker");
var router = express.Router();

// create role
router.post("/create", validateRoleData, errorCatcher, createRole);
// read role
router.get("/", getRoles);
router.get("/:id", getRole);
// update role
router.post("/update/:id", updateRole);
// delete role
router.delete("/delete/:id", deleteRole);


module.exports = router;
