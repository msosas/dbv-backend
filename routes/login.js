var express = require('express');
var router = express.Router();
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var cors = require('cors');
/*passport.use(new LocalStrategy(
  function(username, password, done) {
    
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

router.post('/login',
	passport.authenticate('local', { 
      failureRedirect: '/status' 
  }),
	function(req,res) {
    loggedIn = req.user;
		res.redirect('/');
	}
);
*/

var users = [
  {
    'Usuario': 'mpaolini',
    'Password': 'pal123'
  },
  {
    'Usuario': 'msosa',
    'Password': 'pal123'
  }
]
router.options('/login', cors());
router.post('/login', cors(), function (req, res) {
  for (var i=0; i < users.length; i++) {
    if (users[i].Usuario === req.headers.usuario) {
      if (users[i].Password === req.headers.password) {
        res.send(200)
      }
      else {
        res.status(401).send('Contraseña inválidos');
      }
    }
    else {
      if (i === users.length) {
        res.status(401).send('Usuario o Contraseña inválidos');
      }
    }
  }  
});
module.exports = router;
