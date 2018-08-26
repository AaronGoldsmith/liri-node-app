var dot = require('dotenv').config()
var keys = require('./keys.js');
var fs = require('fs')
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment')



if(process.argv.length<=2){
    console.log("<ERROR>: Provide at least one command"); 
    return;
}

if (dot.error) {
    throw result.error
}
// command variable
var cmd = process.argv[2];
// an array of user input
var cmdlist = process.argv;

// removing default arguments [0 and 1] 
cmdlist.splice(0,3); 
var urlArg = cmdlist.join(" ");

// switch statement on string passed in to program
switch(cmd){
   case("concert-this"): concertThis(urlArg); break; // call concert function 
   case("spotify-this-song"): spotifyThisSong(urlArg); break; // call a spotify function
   case("movie-this"): movieThis(urlArg); break; // call the movie function
   case("do-what-it-says"): followDirections(); break; // does another function
   default: console.log("<ERROR>: Invalid command given"); break;
}

function concertThis(artist){
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryUrl,function(error, response, body) {

        /* If there were no errors and the response code is 200 */
        if (!error && response.statusCode === 200) {
                var shows = JSON.parse(body); // JSON --> Javascript
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

function spotifyThisSong(song){
    var spotify = new Spotify(keys.spotify);
    
    spotify // limiting the search to just top result
        .search({ type: 'track', query: song})
        .then(function(response) {
           
            var item = response.tracks.items[0];
            var timeFrmt = moment(item.album.release_date,"YYYY-MM-DD").format("MM/DD/YYYY")
            console.log(item.name)
            console.log(timeFrmt);
            console.log(item.artists[0].name)
            if(item.preview_url){console.log(item.preview_url)}
            else{console.log("  ~~> \""+item.name+"\" can not be previewed")}
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieThis(movie){
  // movie.split(" ").join("+")
    var queryUrl = "http://www.omdbapi.com/?t="+ movie +"&y=&plot=full&apikey=trilogy"
    var str = "";
    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);
            str += "\n\n\t["+movieObj.Title +"]\n"
            str +="   "+liner(3)+"\n"

            str += "Produced in: " +movieObj.Country.split(", ").join(", and ");
            str +=" in " + movieObj.Year + "\n";
            str += formatList(movieObj.Actors.split(", "),"Starring:");
            str += "\n";

            // Rotten tomatoes is choice #2 if it exists
            if(movieObj.Ratings.length>1){
               str += movieObj.Ratings[1].Source + " gave a rating of "+movieObj.Ratings[1].Value +"\n" ;
            }
         
            str += "Produced in: " +movieObj.Country + "\n";
            str += "Lang: "+movieObj.Language+ "\n";
            str += "IMDB rates it a: " + movieObj.imdbRating+ "\n";

             // adding line breaks
             str += formatText(movieObj.Plot)
        }
        debugger;
        console.log(str);
      });
}
// FORMATTING HELPERS
var liner = function(size){
    var line = "—~—~—~—~"
    return "  "+line.repeat(size)
}
function pretty(category,size){
    return "\n \t~ "+category+" ~\n "+ liner(size) +"\n"; 
}
function formatText(text){
    var str = pretty("PLOT",8)
    var parts = text.split(" ");
    var fun = " |     ";
    str += fun;
    for(var i = 0;i<parts.length;i++){
        str += parts[i] + " ";
        if(i>0&&i%10==0){
            str += "\n" +fun; 
        }
    }
    return str+"\n"+liner(8);
}
function formatList(list,named){
    var str = named;
    
    list.forEach( 
        (item,ind) => str += ("\n   "+(ind+1) + ". " + item));
    return str+"\n"; 
}
// PARENT
    // 1. child
    // 2. child
    // 3. child
function followDirections(){
   fs.readFile("random.txt","utf8",function(error,data){
       if(error){return;}
       var parts = data.split(",");
       switch(parts[0]){
        case("concert-this"): concertThis(parts[1]); break; // call concert function 
        case("spotify-this-song"): spotifyThisSong(parts[1]); break; // call a spotify function
        case("movie-this"): movieThis(parts[1]); break; // call the movie function
        case("do-what-it-says"): followDirections(); break; // does another function
        default: console.log("<ERROR>: Invalid command given"); break;
     }
   })
}
