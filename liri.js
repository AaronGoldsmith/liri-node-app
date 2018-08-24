var dot = require('dotenv').config()
var keys = require('keys.js');
var Spotify = require('node-spotify-api')
if (dot.error) {
    throw result.error
  }

var spotify = new Spotify(keys.spotify);
// take in a command and call function
//var cmd = argv[2]
console.log("here")

/* switch(cmd){
   case("concert-this"): break; // call concert function 
   case("spotify-this-song"): break; // call a spotify function
   case("movie-this"): break; // call the movie function
   case("do-what-it-says"): break; // does another function
   default: console.log("Error: Invalid command given"); break;
} */
formatTitle("There is a boy named Aaron")
formatTitle(" There-is-a-boy-named-Aaron ")

function formatTitle(str){
    var cmpnt = str.trim().split(" ");
    if (cmpnt.length<=1){return str;}
    return 0;
}
function concertThis(artist){
    if(artist.split(" ").length>1){
 	// append all but the last item with API accepted symbol e.g) The+Beatles     
    }
    var queryurl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
}

function spotifyThis(song){
    if(song.split(" ").length>1){

    }
}
function movieThis(movie){
    if(movie.split(" ").length>1){

    }
}
function followDirections(direction){
    if(direction.split(" ").length>1){

    }
}
