var mailer = require('./public/javascripts/mailer.js');

mailer.searchTrain("navy", function(response) {
  console.log('found: ' + response);


  mailer.searchTrain("Pink", function(response) {
    console.log('found: ' + response);

    mailer.searchTrain("unknown", function(response) {
      console.log('found: ' + response);
    });

  });
});

//
// mailer.searchTrain("navy", function(response) {
//   console.log('found: ' + response);
// });
//
//
// mailer.searchTrain("unknown", function(response) {
//   console.log('found: ' + response);
// });
