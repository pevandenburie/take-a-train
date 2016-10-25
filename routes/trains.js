var express = require('express');
var router = express.Router();


var trains = require('../models/train').trains;


router.get('/:name', function(req, res) {

  // Convert Team collection to an object readable by template
  var teams = {};
  trains.findWhere({ Name: req.params.name }).get('teams').forEach(function(team) {
    teams[team.get('Name')] = team.get('users').toJSON();
  });
  console.log('*********');
  console.log(teams);

  res.render('train',
    {
      name: req.params.name,
      train: trains.findWhere({ Name: req.params.name }).get('teams').toJSON(),
      teams: teams,
    });
});


// Get Train selection page
router.get('/', function(req, res, next) {
  res.render('trains',
    { title: 'Take A Train !',
      trains: trains.toJSON() //Object.keys(trains)
    });
});

module.exports = router;
