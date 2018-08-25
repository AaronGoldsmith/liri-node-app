var dot = require('dotenv').config()
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment')
var spotify = new Spotify(keys.spotify);

if (dot.error) {
    throw result.error
}
// an array of user input
var cmds = process.argv;

// command will be third word (element #2)
var cmd = cmds[2];

// 
cmds.splice(0,3); 
var urlarg = cmds.join("+");

switch(cmd){
   case("concert-this"): concertThis(urlarg); break; // call concert function 
   case("spotify-this-song"): break; // call a spotify function
   case("movie-this"): break; // call the movie function
   case("do-what-it-says"): break; // does another function
   case(""): console.log(" no command given")
   default: console.log("ERROR: Invalid command given"); break;
}

function concertThis(artist){
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryUrl,function(error, response, body) {

        /* If there were no errors and the response code was 
        200 (i.e. the request was successful)... */
        if (!error && response.statusCode === 200) {
                // want to use JSON.parse(body)
                var shows = JSON.parse(body);
                console.log(shows.forEach(function(item){

                    var timestamp = moment(item.venue.datetime).format("MM/DD/YYYY")

                    var vName = item.venue.name;
                    var vCity = item.venue.city;
                    // prioritize getting the region, falls back to country
                    var vState = item.venue.region || items.country;
                    
                    // ommit shows where at least one of the required keys are missing
                    if((!vName) || (!vCity) || (!timestamp) ){ 
                        return; 
                    }

                    console.log("(" + timestamp + ")");
                    console.log(vName);
                    console.log(vCity + ", " + vState);
                    console.log("-------------\n")
                    
                }));
        }
    });
      
}

function spotifyThis(song){

}
function movieThis(movie){

}
function followDirections(direction){
    if(direction.split(" ").length>1){

    }
}
