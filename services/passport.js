const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// create an instance of the model User
const User = mongoose.model('users');

// encode user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// decode user id
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// tell the passport library that it should make use of the Google strategy inside our app
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exits inside the users collection
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // we already have a record with the given profile ID
          done(null, existingUser); // null tells passport there was no error and we pass the user info
        } else {
          // we don't have a user record with this ID, make a new record
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user)); // null tells passport there was no error and we pass the newly created user info
        }
      });
    }
  )
);
