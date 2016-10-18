var express = require('express');
var router = express.Router();


router.post('/search', function(req, res, next) {
  var userObj = req.body;
  res.send('Searching for '+userObj.name);
});


module.exports = router;
