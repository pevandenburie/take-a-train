var mailer = require('./public/javascripts/mailer.js');

function print_result(result) {
  result.forEach( function(row) {
    console.log(row);
  });
}

var trains = ["Purple", "Brown", "Saffron", "Green", "Navy", "Grey", "Blue", "Gold", "Orange", "Pink"];

trains.forEach( function(trainName) {
  mailer.searchTrain(trainName, function(response) {
    console.log('Found for '+trainName+': ');
    print_result(response);
    console.log('------------------------------------------');
  });
});

// mailer.searchTrain("navy", function(response) {
//   console.log('found: ');
//   print_result(response);
// });
//
//
// mailer.searchTrain("Pink", function(response) {
//   console.log('found: ');
//   print_result(response);
// });
//
//
// mailer.searchTrain("unknown", function(response) {
//   console.log('found: ');
//   print_result(response);
// });
