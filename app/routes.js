const user = require('../app/models/user');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.post('/update',isLoggedIn , function(req, res) {
      user.findById(req.session.passport.user, function(err, user){
        if(err)console.log(err);
        if(req.body.newEmail != ""){user.local.email = req.body.newEmail};
        if(req.body.newPassword != ""){user.local.password = user.generateHash(req.body.newPassword)};
        user.save(function (err, updatedUser) {
          if (err) console.log(err)
          req.login(user, function(err) {
            if (err) console.log(err)
            res.redirect('/profile')
          });
        });
      });
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            message: req.flash('updateMessage')
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
