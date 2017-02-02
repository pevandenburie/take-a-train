var Backbone = require('backbone');
var Teams = require('../models/team').Teams;
var mailer = require('../public/javascripts/mailer.js');

var Train = Backbone.Model.extend({
  defaults: {
    Name: "NA",
    Description: "",
    Notes: "",
    mailers: [],
    teams: undefined,
  },
  initialize: function() {
    this.set('teams', new Teams());
  },
});

var Trains = Backbone.Collection.extend({
  model: Train,
});

// exports.Train = Train;
// exports.Trains = Trains;



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

var searchUser = function(lookingForUser) {
  var noneFound =  {
    "name": "Not Found",
    "href": "/"
  };
  var founds = [];

  lookingForUser = lookingForUser.toLowerCase();

  trains.forEach(function(train) {
    train.get("teams").forEach(function(team) {

      team.get("users").forEach(function(user) {
        var current = (user.get("DisplayName") || "");
        if (current.toLowerCase().indexOf(lookingForUser) != -1) {
          var found = {
            "name": current,
            "href": ('/trains/'+train.get('Name')+'#'+team.get('Name'))
          };
          founds.push(found);
        }
      });
    });
  });

  if (founds.length === 0) {
    founds.push(noneFound);
  }
  return founds;
}

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

function createTeamMailerCallback(team) {
  return function(response) {
    function print_result(result) {
      if (Array.isArray(result)) {
        result.forEach( function(row) {
          console.log(row);
        });
      }
      else {
        console.log(result);
      }
    }
    print_result(response);
    team.set('mailers', response);
  }
}

function createTeamCallback(train) {
  return function(result) {

    // Process the list of teams
    result.Object.Results.forEach(function(item) {
      console.log(item.Name + ' (' + item._ref + ')');

      // Append the team to the list
      var team = new Team({ Name: item.Name });
      train.get('teams').add( team );


      // Get mailer addresses for the team
      mailer.searchTeam(item.Name, createTeamMailerCallback(team));

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

function createTrainCallback() {
  return function(result) {
    console.log('-----Train--------');
    console.log(result.Object.Name + ' (' + result.Object._ref + ')');
    console.log('Description: ' + result.Object.Description);
    console.log('Notes: ' + result.Object.Notes);
    //console.log(result.Object.Name + ' (' + JSON.stringify(result.Object) + ')');
    console.log('------------------');


    // Append the train to the list
    var train = new Train({
      Name: result.Object.Name,
      Description: result.Object.Description,
      Notes: result.Object.Notes
    });
    trains.add( train );

    // Get mailer addresses for the train
    mailer.searchTrain(result.Object.Name, function(response) {

      // function print_result(result) {
      //   result.forEach( function(row) {
      //     console.log(row);
      //   });
      // }
      // print_result(response);

      train.set('mailers', response);
    });

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

      var trainCallback = createTrainCallback();
      restApi.get({
          ref: item,
          fetch: ['FormattedID', 'Name', 'Children', 'Description', 'Notes'], //fields to fetch
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


exports.trains = trains;
exports.searchUser = searchUser;
