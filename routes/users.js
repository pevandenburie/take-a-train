var express = require('express');
var router = express.Router();

var searchUser = require('../models/train').searchUser;
var searchTeam = require('../models/train').searchTeam;


router.post('/search', function(req, res, next) {
  var noneFound =  {
    "name": "Not Found",
    "href": "/"
  };
  var userObj = req.body;
  var founds = searchUser(userObj.name);

  /*console.log("Users founds " + founds.length);
  founds.forEach( function(u){
    console.log(u.name + u.href);
  } );*/

  // no user found; look for a team
  if (founds.length === 0) {
    founds = searchTeam(userObj.name);
  }

  /*console.log("Teams founds " + founds.length);
  founds.forEach( function(u){
    console.log(u.name + u.href);
  } );*/

  if (founds.length === 0) {
    founds.push(noneFound);
  }

  res.render('searchUser', { users: founds });

});


module.exports = router;
