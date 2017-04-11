const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

/*
  Use user id and app secret to generate random token
  with timestamp
*/
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

/*
  Give user Token
*/
exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'Email and Password Required' });
  }
  /*
    Signup route
    check if user exists
    send error if yes or create and save into db
    respond with success indicator
  */
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }
      res.json({ token: tokenForUser(user) });
    });
  });
}
