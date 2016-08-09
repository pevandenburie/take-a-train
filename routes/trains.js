var express = require('express');
var router = express.Router();

var Train = require('../models/train').Train;
var Trains = require('../models/train').Trains;
var Team = require('../models/team').Team;
var Teams = require('../models/team').Teams;
var User = require('../models/user').User;
var Users = require('../models/user').Users;

var rally = require('rally');
var restApi = rally({
    //user: 'paulvand', //required if no api key, defaults to process.env.RALLY_USERNAME
    //pass: '1234', //required if no api key, defaults to process.env.RALLY_PASSWORD
    //apiKey: '_GeUV8XARSxa9zLefh...', //preferred, required if no user/pass, defaults to process.env.RALLY_API_KEY
    //apiVersion: 'v2.0', //this is the default and may be omitted
    //server: 'https://rally1.rallydev.com',  //this is the default and may be omitted
    requestOptions: {
        headers: {
            'X-RallyIntegrationName': 'Take a Train',  //while optional, it is good practice to
            'X-RallyIntegrationVendor': 'Cisco',             //provide this header information
            'X-RallyIntegrationVersion': '1.0'
        }
        //any additional request options (proxy options, timeouts, etc.)
    }
});


// global list of trains
var trains = new Trains();

function getUsernameFromEmail(email) {
  return email.split('@')[0];
}


function createTeamMembersCallback(team) {
  return function(result) {

    // Display each team member
    result.Object.Results.forEach(function(item) {
      console.log(item.DisplayName + ' (' + item.EmailAddress + ')');

      // Append the user to the list
      var user = new User({
        DisplayName: item.DisplayName,
        EmailAddress: item.EmailAddress,
        Role: item.Role,
        username: getUsernameFromEmail(item.EmailAddress),
      });
      team.get('users').add( user );

    });
  };
};

function createTeamCallback(train) {
  return function(result) {
    // Process the list of teams
    result.Object.Results.forEach(function(item) {
      console.log(item.Name + ' (' + item._ref + ')');

      // Append the team to the list
      var team = new Team({ Name: item.Name });
      train.get('teams').add( team );

      // Retrieve the Team members
      var teamMembersCallback = createTeamMembersCallback(team);
      restApi.get({
        ref: item.TeamMembers,
      }).then(teamMembersCallback)
      .fail(function(errors) {
         console.log(errors);
      });

    });
  };
}

function createTrainCallback(train) {
  return function(result) {
    console.log(result.Object.Name + ' (' + result.Object._ref + ')');
    console.log('------------------');

    //
    // // Append the train to the list
    // var train = new Train({ Name: item.Name });
    // trains.add( train );

    // Get list of teams
    var teamCallback = createTeamCallback(train);
    restApi.get({
      ref: result.Object.Children,
    }).then(teamCallback)
    .fail(function(errors) {
       console.log(errors);
    });
  };
}


function createTrainsCallback(trains) {
  return function(result) {
    // Process the list of trains
    result.Object.Results.forEach(function(item) {

      // Append the train to the list
      var train = new Train({ Name: item.Name });
      trains.add( train );

      // Retrieve the train object
      var trainCallback = createTrainCallback(train);
      restApi.get({
          ref: item,
          fetch: ['FormattedID', 'Name', 'Children'], //fields to fetch
      }).then(trainCallback)
      .fail(function(errors) {
        console.log(errors);
      });

    });
  };
}


var trainsCallback = createTrainsCallback(trains);

restApi.get({
  ref: '/project/29404291867/Children',  // Infinite Home Feature Teams Children
}).then(trainsCallback)
.fail(function(errors) {
   console.log(errors);
});



router.get('/:name', function(req, res) {

  //console.log(trains.findWhere({ Name: req.params.name }).get('teams').toJSON());

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
