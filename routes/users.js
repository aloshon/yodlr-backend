var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users);
const { createToken } = require("../tokens");

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
});

/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  let allUsers = _.toArray(users);
  for(let i = 0; i < allUsers.length; i++){
    // user already exists, so set state to active and return user
    if(allUsers[i].email === user.email){
      allUsers[i].state = "active";
      return res.json(allUsers[i])
    } 
  }
  // now it adds new user at end of list instead of replacing last user
  user.id = (curId + 1);
  curId += 1;
  if (!user.state) {
    user.state = 'pending';
  }
  user.isAdmin = false;
  users[user.id] = user;
  log.info('Created user', user);
  res.json(user);
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  res.json(users[req.params.id]);
});

// /* Sign up user and return token from their email */
// router.get('/signup', function(req, res, next) {
//   const user = users[req.query.]
//   const token = createToken(req.query.email);

//   if (!user) {
//     return next();
//   }
//   res.json(users[req.params.id]);
// });

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info('Deleted user', user);
  res.json(user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  
  if (user.id != req.params.id) {
    return next(new Error('ID paramter does not match body'));
  }
  
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});




module.exports = router;
