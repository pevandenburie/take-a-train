var mailer = require('./public/javascripts/mailer.js');

function print_result(result) {
  result.forEach( function(row) {
    console.log(row);
  });
}

mailer.searchTrain("navy", function(response) {
  console.log('found: ');
  print_result(response);
});


mailer.searchTrain("Pink", function(response) {
  console.log('found: ');
  print_result(response);
});


mailer.searchTrain("unknown", function(response) {
  console.log('found: ');
  print_result(response);
});
