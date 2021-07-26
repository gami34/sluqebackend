const config = require("./config");

exports.fbServiceAccountKey = {
     "type": config.FIREBASE.TYPE,
     "project_id": config.FIREBASE.PROJECT_ID,
     "private_key_id": config.FIREBASE.PRIVATE_KEY_ID,
     "private_key": config.FIREBASE.PRIVATE_KEY.replace(/\\n/g, '\n'),
     "client_email": config.FIREBASE.CLIENT_EMAIL,
     "client_id": config.FIREBASE.CLIENT_ID,
     "auth_uri": config.FIREBASE.AUTH_URI,
     "token_uri": config.FIREBASE.TOKEN_URI,
     "auth_provider_x509_cert_url": config.FIREBASE.AUTH_PROVIDER_X509_CERT_URL,
     "client_x509_cert_url": config.FIREBASE.CLIENT_X509_CERT_URL
}
