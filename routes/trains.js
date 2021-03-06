var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger();

var trains = require('../models/train').trains;


router.get('/:name', function(req, res) {

  logger.info('action="get train '+req.params.name+'"');

  var train = trains.findWhere({ Name: req.params.name });

  // Convert Team collection to an object readable by template
  var teams = {};
  train.get('teams').forEach(function(team) {
    var teamName = team.get('Name');
    teams[teamName] = {};
    teams[teamName]['users'] = team.get('users').toJSON();
    teams[teamName]['mailers'] = team.get('mailers');
  });
  //console.log('*********');
  //console.log(teams);

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
  logger.info('action="get trains"');
  res.render('trains',
    { title: 'Take A Train !',
      trains: trains.toJSON()
    });
});

module.exports = router;
