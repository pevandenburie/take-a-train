var mailer = require('./public/javascripts/mailer.js');

function print_result(result) {
  result.forEach( function(row) {
    console.log(row);
  });
}

var trains = ["Purple Train", "Brown Train", "Saffron Train", "Green Train", "Navy Train", "Grey Train", "Blue Train", "Gold Train", "Orange Train", "Pink Train"];

trains.forEach( function(trainName) {
  mailer.searchTrain(trainName, function(response) {
    console.log('Found for '+trainName+': ');
    print_result(response);
    console.log('------------------------------------------');
  });
});
