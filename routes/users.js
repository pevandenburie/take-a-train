var express = require('express');
var router = express.Router();

var searchUser = require('../models/train').searchUser;


router.post('/search', function(req, res, next) {
  var userObj = req.body;
  var founds = searchUser(userObj.name);

  /*console.log("founds " + founds.length);
  founds.forEach( function(u){
    console.log(u.name + u.href);
  } );*/
  res.render('searchUser', { users: founds });
});


module.exports = router;
