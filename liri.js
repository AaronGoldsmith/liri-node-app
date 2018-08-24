require("dotenv").config()
var spotify = new Spotify(keys.spotify);

// take in a command and call function
var cmd = argv[2]

switch(cmd){
   case("concert-this"): break; // call concert function 
   case("spotify-this-song"): break; // call a spotify function
   case("movie-this"): break; // call the movie function
   case("do-what-it-says"): break; // does another function
   default: console.log("Error: Invalid command given"); break;
}

function concertThis(artist){
    if(artist.split(" ").length>1){
 	// append all but the last item with API accepted symbol e.g) The+Beatles     
    }
}

function spotifyThis(song){
    if(song.split(" ").length>1){

    }
}
function movieThis(movie){
    if(movie.split(" ").length>1){

    }
}
function followDirections(song){
    if(song.split(" ").length>1){

    }
}
