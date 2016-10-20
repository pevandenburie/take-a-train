var express = require('express');
var router = express.Router();

var searchUser = require('../models/train').searchUser;


router.post('/search', function(req, res, next) {
  var userObj = req.body;
  // res.send('Searching for '+userObj.name);

  var found = searchUser(userObj.name);
  //res.send('Searching for '+userObj.name+': '+found.user+' '+found.href);
  res.render('searchUser', found);
});


module.exports = router;
