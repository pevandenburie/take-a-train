var Backbone = require('backbone');

var User = Backbone.Model.extend({
  defaults: {
    DisplayName: 'NA',
    username: '',
    EmailAddress: '',
    Role: '',
  }
});

var Users = Backbone.Collection.extend({
  model: User,
});

exports.User = User;
exports.Users = Users;
