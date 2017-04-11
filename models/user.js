const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

/*
  Model Definition
  Email has unique validation
*/
  const userSchema = new Schema({
    email: { type : String, unique: true, lowercase: true  },
    password: { type: String }
  });

/*
  Save Hook
  before user is saved first generate salt
  then use salt to hash password
  after password is hashed call next() and save
*/
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
      if (err) { return callback(err); }

      callback(null, isMatch);
    });
}

/*
  Model Class
  add the model as schema to mongoose as a collection of user
*/
const ModelClass = mongoose.model('user', userSchema);

/*
  Export Model
*/
module.exports = ModelClass;
