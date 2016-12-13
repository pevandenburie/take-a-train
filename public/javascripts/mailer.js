
var http = require('https');

// The HTTP request we want is https://ews-aln-core.cisco.com/itsm/mailer/rest/search/*ih_navy*;format=csv
var origin_path = "/itsm/mailer/rest/search/";

var options = {
  host : "ews-aln-core.cisco.com",
  path : "",
  auth : process.env.MAILER_USER_PASSWORD // Must be username:password format
};

function processCSV(result_string) {
  var result_array = [];
  // Remove the 'header' of the table (item,mailer,Status,description)
  //var result_array = result_string.split('\n').splice(0, 1);
  var arr = result_string.split('\n');
  arr.splice(0, 1);
  arr.forEach( function(row) {
    if (row.length > 1) { // due to the split, we still may have an (empty) row
      var splitted = row.split(',');

      var result_entry = {};
      result_entry["mailer"] = splitted[1].trim();
      result_entry["description"] = splitted[3].trim();

      //console.log(result_entry);
      result_array.push(result_entry);
    }
  });

  return result_array;
}


var searchTrain = function(trainName, cb) {

  var mailer_cb = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      //console.log(str);
      var result_array = processCSV(str);
      cb(result_array);
    });
  };

  // In case the train name is "Orange Train", convert to "orange"
  trainName = trainName.toLowerCase().split(' ')[0];
  options.path = origin_path + '*ih_'+trainName+'*;format=csv';
  console.log("option.path: "+options.path);

  http.request(options, mailer_cb)
    .on('error', function(error) {
      //console.log('Error: ' + error.message);
      cb(error.message);
    })
    .end();
}

exports.searchTrain = searchTrain;
