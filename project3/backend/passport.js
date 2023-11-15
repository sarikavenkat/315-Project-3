const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: oauth.env.CLIENT_ID,
      clientSecret: oauth.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
        // Code to handle user authentication and retrieval
        //console.log('TCL: profile', profile); //Gives profile info
        //console.log('TCL: refreshToken', refreshToken); //Null
        //console.log('TCL: accessToken', accessToken); 
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