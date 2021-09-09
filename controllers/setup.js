const expressAsyncHandler = require("express-async-handler");
const config = require("../config/config");
const { BackendUser } = require("../models/backendUserModel");
const Role = require("../models/roleModel");
const SystemResource = require("../models/systemResourceModel");
const { User } = require("../models/userModel")


exports.backendSetup = expressAsyncHandler(async () => {

    /** CREATE A SUPERUSER BACKEND  ACCOUNT ON LAUNCH */
    User.findOne({ email: config.SETUP.superUserEmail }, async (err, superUser) => {
        if (err) return;
        if (superUser) return;
        // else no data was found, create one
        let data = {
            department: config.SETUP.department,
            email: config.SETUP.email,
            agreement: config.SETUP.agreement,
            password: config.SETUP.password
        }

        // 

        let responseUserID = await createBackenduser(data); //:: returns user._id

        if (responseUserID) {
            /** CREATE THE DEFAULT ROLES :: SUPER ROLE AND AUTH ROLE  */
            // check if superadmin && auth role already exist
            Role.findOne({ name: "superadmin".toLowerCase() }, (errSuper, superRole) => {
                if (errSuper) return;
                Role.findOne({ name: "authenticated".toLowerCase() }, async (errAuth, authRole) => {
                    // error or account exits
                    if (errSuper || errAuth) return false;
                    // roles already exist
                    if (superRole && authRole) return false;
                    // if superROle, create authROle

                    let resSuper, resAuth;

                    if (!superRole) {
                        // create role for the users 
                        resSuper = await createRole("superadmin", "superadmin", "complete access", responseUserID)
                        // creat the coresponsing permision system
                    }
                    if (!authRole) {
                        resAuth = await createRole("authenticated", "authenticated", "controled access", responseUserID)
                    }

                    await createResource() // list of default system resource

                    //response
                    return resSuper && resAuth;
                })
            })

        } else { return false; }

    })
})

const createRole = async (name, slug, description, creator) => {
    let newRole = new Role({ name, slug, description, creator })
    try {
        newRole.save(err => {
            if (err) return false;
            return true;
        })
    } catch (error) {
        console.error("error occured while creating role")
        return false
    }
}

const createBackenduser = async (data) => {
    // create a new account
    let _idValue;
    await User.register(
        new User({
            username: data.email,
            department: data.department,
            email: data.email,
            agreement: data.agreement,
        }),
        data.password
    )
    await User.findOne({ email: data.email }, async (err, user) => {
        if (err) return false;
        _idValue = await user._id
    })
    return _idValue;
}

const createResource = async () => {
    // create a lioop that generate  a list resources bbased permission 
    let resources = [{ name: "user", slug: "user", activated: false, description: "user creation services" }, { name: "role", slug: "role", activated: false, description: "role creation resource" }, { name: "permission", slug: "permission", activated: false, description: "permissin for all role services" }, { name: "resources", slug: "resources", activated: false, description: "resources for all permission services" }]
    // save this information to the permission model on mongo
    SystemResource.insertMany(resources, (err) => {
        if (err) return false;
        return true;
    })
}