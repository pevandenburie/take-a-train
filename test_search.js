
var searchUser = require('./models/train').searchUser;

var founds = searchUser("david");

console.log("Users founds: " + founds.length);
founds.forEach( function(u){
  console.log(u.name + u.href);
} );
