require("dotenv").config(); // this helps load the environment viriable

module.exports = {
    LOCAL : {
        SECRET: process.env.SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },

    FIREBASE : {
        TYPE: process.env.TYPE,
        PROJECT_ID: process.env.PROJECT_ID,
        PRIVATE_KEY_ID: process.env.PRIVATE_KEY_ID,
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        CLIENT_EMAIL: process.env.CLIENT_EMAIL,
        CLIENT_ID: process.env.CLIENT_ID,
        AUTH_URI: process.env.AUTH_URI,
        TOKEN_URI: process.env.TOKEN_URI,
        AUTH_PROVIDER_X509_CERT_URL: process.env.AUTH_PROVIDER_X509_CERT_URL,
        CLIENT_X509_CERT_URL: process.env.CLIENT_X509_CERT_URL,
    },

    GOOGLE_API : {
        CLIENT_ID: process.env.CLIENT_ID_GOOGLE_API,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
    },



};
