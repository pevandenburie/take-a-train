var mailer = require('./public/javascripts/mailer.js');

function print_result(result) {
  result.forEach( function(row) {
    console.log(row);
  });
}

// (search for '_' returns results for both '-' and '_')

var teams = [
  "Mallard",
  "Wembley",
  "The Calabash", // thecalabash_devlopers  vgw-thecalabash-scrum  (OK)
  "Olimpico",     // ih_millennium_olimpico_sms  phoenix_olimpico_scrum_team  vgw_millennium_and_olimpico_scrums  (OK)
  "Valhalla",
  "Millennium",   // phoenix_millennium_scrum_team  ih_millennium_olimpico_sms  vgw_millennium_and_olimpico_scrums  (OK)
  "Centenario",
  "PC_Mac",       // ih_pcmac_scrum_team  (OK)
  "Falmer",
  "Allianz",
  "Roland Garros",
  "Three Rivers",
  "Golden Gate",  // goldengate_spvtg
  "Alchemy",      // alchemy_scrum  (OK)
  "Mojave",       // mojave_scrum  (OK)
  "Peachtree",    // vgw_peachtree_scrumteam_us  (OK)
  "Hooli",
  "Camp Nou",
  "Zorro",
  "Olympia",
  "Arkham",
  "The Peloton",  // peloton  (Not OK)
  "Astronomer",   // ???  veop_ast  ???  (Not OK)
  "Azteca",
  "Oceane",
  "Madras Cafe",  // madras-cafe  madras_cafe_dev  madras_cafe  (OK)
  "Torrent",      // vgw_torrent  (OK)
  "Shikra",       // che_shikra  vgw_shikra  (OK)
  "Swan",         // vgw_swan  (OK)
  "Lunar",
  "Teddy",
  "Dynamo",
  "iOS",          // ve_ios_dev  (OK)
  "Android",
  "Charlety",
  "Baradel",
  "Apple Pie",    // ve_ios_apple_pie_dev  (OK)
  "Gadwall",
  "Chennai Central",  // chennai-central chennai_central  (OK)
  "Winter",
  "Foxboro",
  "Malka",          // scrum-malka  scrum-malka-dev  (OK)
  "Indian Runner",  // indianrunner  (OK)
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
