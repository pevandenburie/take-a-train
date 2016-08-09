var Backbone = require('backbone');
var Teams = require('../models/team').Teams;

var Train = Backbone.Model.extend({
  defaults: {
    Name: "NA",
    teams: undefined,
  },
  initialize: function() {
    this.set('teams', new Teams());
  },
});

var Trains = Backbone.Collection.extend({
  model: Train,
});

exports.Train = Train;
exports.Trains = Trains;
