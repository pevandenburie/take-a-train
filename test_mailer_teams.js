var mailer = require('./public/javascripts/mailer.js');

function print_result(result) {
  result.forEach( function(row) {
    console.log(row);
  });
}


var teams = [
  "Mallard",
  "Wembley",
  "The Calabash",
  "Olimpico",
  "Valhalla",
  "Millennium",
  "Centenario",
  "PC_Mac",
  "Falmer",
  "Allianz",
  "Roland Garros",
  "Three Rivers",
  "Golden Gate",
  "Alchemy",
  "Mojave",
  "Peachtree",
  "Hooli",
  "Camp Nou",
  "Zorro",
  "Olympia",
  "Arkham",
  "The Peloton",
  "Astronomer",
  "Azteca",
  "Oceane",
  "Madras Cafe",
  "Torrent",
  "Shikra",
  "Swan",
  "Lunar",
  "Teddy",
  "Dynamo",
  "iOS",
  "Android",
  "Charlety",
  "Baradel",
  "Apple Pie",
  "Gadwall",
  "Chennai Central",
  "Winter",
  "Foxboro",
  "Malka",
  "Indian Runner",
  "Welkin",
  "Atlantis",
  "Turbo",
  "Le Chaudron",
];

teams.forEach( function(teamName) {
  mailer.searchTeam(teamName, function(response) {
      console.log('Found for '+teamName+': ');
      print_result(response);
      console.log('------------------------------------------');
  });
});
