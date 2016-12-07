
var http = require('https');

// The HTTP request we want is https://ews-aln-core.cisco.com/itsm/mailer/rest/search/*ih_navy*;format=csv
var options = {
  host : "ews-aln-core.cisco.com",
  path : "/itsm/mailer/rest/search/",
  auth : process.env.MAILER_USER_PASSWORD // Must be username:password format
};


var searchTrain = function(trainName, cb) {

  var mailer_cb = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      //console.log(str);
      cb(str);
    });
  };

  options.path += '*ih_'+trainName.toLowerCase()+'*;format=csv';
  http.request(options, mailer_cb)
    .on('error', function(error) {
      //console.log('Error: ' + error.message);
      cb(error.message);
    })
    .end();
}

exports.searchTrain = searchTrain;
//module.exports.searchTrain = searchTrain;
