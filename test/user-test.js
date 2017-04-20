const chai = require('chai');
const should = require('chai').should();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('../app/models/user');
var db;

describe('User', function(){
  before(function() {
    db = mongoose.connect('mongodb://localhost/test');
  })

  it('should be invalid if email is empty', function(done) {
    var newUser = new User();
    newUser.validate(function(err){
      err.errors["local.email"].should.exist;
      done();
    })
  })

  it('should be invalid if password is empty', function(done) {
    var newUser = new User();
    newUser.validate(function(err){
      err.errors["local.password"].should.exist;
      done();
    })
  })

  it('can add a user', function(done){
    var newUser = new User({
      local:{
        email: 'newUser@test.com',
        password: 'test1234'
      }
    })
    newUser.save(function(err){
      if(err) console.log("Error: " + err.message)
      User.findOne({'local.email': 'newUser@test.com'}, function (err, user) {
        if (err) console.log(err)
        user.local.email.should.eql('newUser@test.com')
        user.local.password.should.eql('test1234')
      })
      done();
    })
  })

  afterEach(function(done){
    mongoose.connection.collections.users.drop(function() {
      console.log("Dropped");
      done();
    })
  })

  after(function() {
    db.disconnect();
  })
  describe('Changes', function(){
    beforeEach(function(done) {
      var user = new User({
        local:{
          email: 'test@example.com',
          password: 'test'
        }
      })
      user.save(function(err){
        if(err) console.log("Error: " + err.message)
        done();
      })
    })
    it('can find a user by email', function(done) {
      User.findOne({'local.email':'test@example.com'}, function(err, user) {
        user.local.email.should.eql('test@example.com')
        done();
      })
    })
    it('can update a user', function(done){
      var id;
      User.findOne({'local.email':'test@example.com'}, function(err, user) {
        user.local.email = "edittest@example.com";
        user.local.password = "edittest";
        id = user._id;
        user.save(function(err){
          if(err) console.log("Error: " + err.message);
          User.findById(id, function(err, user) {
            user.local.email.should.eql("edittest@example.com");
            user.local.password.should.eql("edittest");
            done();
          })
        })
      })
    })
  })
})
