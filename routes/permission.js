var express = require("express");
const { getPermissionByResource, createPermission, createCreateAnyPermission, createCreateOwnPermission, createReadAnyPermission, createReadOwnPermission, createUpdateAnyPermission, createUpdateOwnPermission, createDeleteAnyPermission, createDeleteOwnPermission, deleteCreateAnyPermission, deleteCreateOwnPermission, deleteReadAnyPermission, deleteReadOwnPermission, deleteUpdateOwnPermission, deleteUpdateAnyPermission, deleteDeleteAnyPermission, deleteDeleteOwnPermission, readPermissions, allowAttributePermission, denyAttributePermission } = require("../controllers/permission");
var router = express.Router();


/* GET ALL RESOURCE LISTING BY NAME */
router.get("/:role/:resource", getPermissionByResource);

/** RESOURCE MANAGEMENT SYSTEM */
// create 8 role process
router.post("/createpermission", createPermission);
router.post("/createcreateanypermission", createCreateAnyPermission);
router.post("/createcreateownpermission", createCreateOwnPermission);
router.post("/createreadanypermission", createReadAnyPermission);
router.post("/createreadownpermission", createReadOwnPermission);
router.post("/createupdateanypermission", createUpdateAnyPermission);
router.post("/createupdateownpermission", createUpdateOwnPermission);
router.post("/createdeleteanypermission", createDeleteAnyPermission);
router.post("/createdeleteownpermission", createDeleteOwnPermission);
// read role
router.get("/readpermissions", readPermissions);
// update role
router.post("/deleteCreateAnyPermission", deleteCreateAnyPermission);
router.post("/deleteCreateOwnPermission", deleteCreateOwnPermission);
router.post("/deleteReadAnyPermission", deleteReadAnyPermission);
router.post("/deleteReadOwnPermission", deleteReadOwnPermission);
router.post("/deleteUpdateAnyPermission", deleteUpdateAnyPermission);
router.post("/deleteUpdateOwnPermission", deleteUpdateOwnPermission);
router.post("/deleteDeleteAnyPermission", deleteDeleteAnyPermission);
router.post("/deleteDeleteOwnPermission", deleteDeleteOwnPermission);
// attribute update
router.post("/allowattribute", allowAttributePermission);
router.post("/denyattribute", denyAttributePermission);


module.exports = router;