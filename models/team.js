var Backbone = require('backbone');
var Users = require('../models/user').Users;

var Team = Backbone.Model.extend({
  defaults: {
    Name: 'NA',
    mailers: [],
    users: undefined,
  },
  initialize: function() {
    this.set('users', new Users());
  },
});

var Teams = Backbone.Collection.extend({
  model: Team,
});

exports.Team = Team;
exports.Teams = Teams;
