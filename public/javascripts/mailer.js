var http = require('https');
var logger = require('log4js').getLogger();

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
  var arr = result_string.split('\n');
  arr.splice(0, 1);
  arr.forEach( function(row) {
    //console.log("row length: " + row.length);
    if (row.length > 1) { // due to the split, we still may have an (empty) row
      var splitted = row.split(',');

      if (splitted.length < 4) {  // In case of error, we receive an HTML error page
        console.log("Wrong Mailer row: " + splitted);
      } else
      {
        var result_entry = {};
        result_entry["mailer"] = splitted[1].trim();
        result_entry["description"] = splitted[3].trim();

        //console.log(result_entry);
        result_array.push(result_entry);
      }
    }
  });

  return result_array;
}


function createMailerCb(cb) {

  return function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      var result_array = processCSV(str);
      logger.info('payloadFormat="csv"'+', payload="'+str+'"');
      //logger.info('payloadFormat="json"'+', payload="'+JSON.stringify(result_array)+'"');
      cb(result_array);
    });
  };
}


var searchTrain = function(trainName, cb) {

  var mailer_cb = createMailerCb(cb);

  // In case the train name is "Orange Train", convert to "orange"
  trainName = trainName.toLowerCase().split(' ')[0];
  options.path = origin_path + 'ih_'+trainName+'*;format=csv';
  logger.info('action="mailer search train '+trainName+'"' + ', options_path="'+options.path+'"');

  http.request(options, mailer_cb)
    .on('error', function(error) {
      logger.error(error.message);
      cb(error.message);
    })
    .end();
}


function createMailerCbRecursive(teamNameList, cb) {

  return function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      //console.log(str);
      var result_array = processCSV(str);
      if ((result_array.length === 0) && (teamNameList.length > 0)) {
          searchTeamRecursive(teamNameList, cb);
      } else {
        logger.info('payloadFormat="csv"'+', payload="'+JSON.stringify(str)+'"');
        //logger.info('payloadFormat="json"'+', payload="'+JSON.stringify(result_array)+'"');
        cb(result_array);
      }
    });
  };
}

function searchTeamRecursive(teamNameList, cb) {

  var mailer_cb = createMailerCbRecursive(teamNameList, cb);

  options.path = teamNameList.shift();
  logger.info('action="mailer search team"' + ', options_path="'+options.path+'"');

  http.request(options, mailer_cb)
    .on('error', function(error) {
      logger.error(error.message);
      cb(error.message);
    })
    .end();
}


var searchTeam = function(teamName, cb) {

    var teamNameFormatted = "";
    var teamNameList = [];

    // In case the team name is "Roland Garros", search for "ih_roland_garros*"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path + 'ih_'+teamNameFormatted+'*;format=csv' );

    // In case the team name is "Roland Garros" or "PC_Mac", search for "ih_rolandgarros*" or "ih_pcmac*"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '');
    teamNameFormatted = teamNameFormatted.replace('_', '');
    teamNameList.push( origin_path + 'ih_'+teamNameFormatted+'*;format=csv' );

    // Try with "phoenix_" instead of "ih_"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path + 'phoenix_'+teamNameFormatted+'*;format=csv' );

    // Try with "vgw_" instead of "ih_"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path + 'vgw_'+teamNameFormatted+'*;format=csv' );

    // Try with "teamName_scrum"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path +teamNameFormatted+'_scrum;format=csv' );

    // In case the team name is "Golden Gate", search for "goldengate_spvtg"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '');
    teamNameList.push( origin_path +teamNameFormatted+'_spvtg;format=csv' );

    // Try with "ve_*teamname_dev*" instead of "ih_"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path + 've_*'+teamNameFormatted+'_dev*;format=csv' );


    // Try with "scrum-teamname*" instead of "ih_"
    teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
    teamNameList.push( origin_path + 'scrum-'+teamNameFormatted+'*;format=csv' );


    //--------------------------------------------------------------------------
    // Hardcoded solutions for teams particularly hard to find in Mailer
    if (teamName === "Astronomer") {
      teamNameList.push( origin_path + 'veop_ast;format=csv' );
    } else if (teamName === "The Peloton") {
      teamNameList.push( origin_path + 'peloton;format=csv' );
    } else {

      //--------------------------------------------------------------------------
      // Below searches return a "lot of results": keep them for the end
      // (search for '_' returns results for both '-' and '_')

      // In case the team name is "Madras Cafe", search for "madras_cafe*"
      teamNameFormatted = teamName.toLowerCase().replace(/ /g, '_');
      teamNameList.push( origin_path +teamNameFormatted+'*;format=csv' );

      // In case the team name is "Indian Runner", search for "*indianrunner*"
      // This should return the last unfound teams
      teamNameFormatted = teamName.toLowerCase().replace(/ /g, '');
      teamNameList.push( origin_path + '*' +teamNameFormatted+'*;format=csv' );
    }

    searchTeamRecursive(teamNameList, cb);
}

exports.searchTrain = searchTrain;
exports.searchTeam = searchTeam;
