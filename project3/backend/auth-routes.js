const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req,res) => {
    res.redirect('/login');
});

//auth logout
router.get('/logout', (req,res) => {
    //passport do things
    req.logout();
    res.redirect('/');
});


//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback route for google
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>{
    //res.send(req.user);
    res.redirect('/');
});

module.exports = router;