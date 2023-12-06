const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('./user-model');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: '/auth/google/redirect',
      scope: ['profile']
    },
    (accessToken, refreshToken, profile, done) => {
        // Code to handle user authentication and retrieval
        console.log("You are in fact reaching this part in passport");
        User.findOne({googleId:profile.id}).then((currentUser)=>{
          if(currentUser){
            //user already exists

          }
          else{
            new User({
              username: profile.displayName,
              googleId: profile.id
            }).save().then((newUser)=>{
              //new user created
            });
          }
        });
        
        // This attaches the user profile to the req object
        done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  // Code to serialize user data
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Code to deserialize user data
    User.findById(id).then((user)=>{
        done(null,user)
    })
});