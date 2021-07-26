var { User } = require("../models/userModel");
var config = require("./config");
var LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var GoogleOAuth2Strategy = require("passport-google-oauth").OAuth2Strategy;

// options for the jwt strategy
var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.LOCAL.SECRET,
};

var googleOptions = {
  clientID: config.GOOGLE_API.CLIENT_ID,
  clientSecret: config.GOOGLE_API.CLIENT_SECRET,
  callbackURL: "/v1/api/auth/googleredirect",
};

module.exports = function (passport) {
  // using passport local strategy
  passport.use(new LocalStrategy(User.authenticate()));
  // using the jwt strategy
  passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done) => {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        } else if (!user) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      });
    })
  );
  passport.use(
    new GoogleOAuth2Strategy(
      googleOptions,
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((user) => {
          if (user) {
            return done(null, user);
          } else {
            // we need to create a user based on the received profile
            User.register(
              new User({
                username: profile.id.toString(),
                displayName: profile.displayName,
                sex: "",
                email: "",
                phoneNumber: "",
                photoURL: profile?._json?.picture,
                provider: profile?.provider,
                googleId: profile?.id,
              }),
              profile.id.toString(),
              (err, user) => {
                if (err) {
                  done(err, false);
                } else {
                  done(null, user);
                }
              }
            );
          }
        });
      }
    )
  );
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
