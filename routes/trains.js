var express = require('express');
var router = express.Router();


var trains = require('../models/train').trains;


router.get('/:name', function(req, res) {

  var train = trains.findWhere({ Name: req.params.name });

  // Convert Team collection to an object readable by template
  var teams = {};
  train.get('teams').forEach(function(team) {
    teams[team.get('Name')] = team.get('users').toJSON();
  });
  console.log('*********');
  console.log(teams);

  res.render('train',
    {
      Name: train.get('Name'),
      Description: train.get('Description'),
      Notes: train.get('Notes'),
      train: train.get('teams').toJSON(),
      mailers: train.get('mailers'),
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
