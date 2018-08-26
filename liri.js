/* Node Packages  */
var dot = require('dotenv').config()
var keys = require('./keys.js');
var fs = require('fs')
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment')


if (dot.error) {
    throw result.error
}

/* 
    `process.argv` contains an array of values 
     passed in through stdin (standard input) 
 */
var cmd = process.argv[2];
var cmdlist = process.argv;


/* 
    splicing out elements in process.argv position 0 to 3
    removes both default arguments (index 0 and 1),  
    as well as the command given as the argument in index 2
*/
    // cmdlist.splice(0,3); 
var urlArg = cmdlist.splice(3,cmdlist.length).join(" ");
console.log(urlArg);

// use a switch statement to determine which command was passed in
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

    /*  If there were no errors and the response code is 200 */
        if (!error && response.statusCode === 200) {
        /*      response and body are both JSOn objects,
                want to parse into JS obj 
        */
                var shows = JSON.parse(body); 
                console.log(shows.forEach(function(item){

                    var timestamp = moment(item.datetime).format("MM/DD/YYYY")

                    var vName = item.venue.name;
                    var vCity = item.venue.city;
                    // prioritize getting the region, falls back to country
                    var vState = item.venue.region || item.venue.country;
                    // ommit shows where at least one of the required keys are missing
                    if((!vName) || (!vState) || (!timestamp) ){ 
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
        return 0;
}

function movieThis(movie){
    var queryUrl = "http://www.omdbapi.com/?t="+ movie +"&y=&plot=short&apikey=trilogy"
    var str = "";
    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);
            str += "\n\n\t["+movieObj.Title +"]\n"
            str +="   "+liner(movieObj.Title.length)+"\n"

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
        console.log(str);
      });
      return 0;
}
// FORMATTING HELPERS
var liner = function(size){
    var line = "—~"
    return line.repeat(size)
}
function pretty(category,size){
    return "\n \t~ "+category+" ~\n "+ liner(size) +"\n"; 
}
function formatText(text){
    var parts = text.split(" ");
    var bdr = " |     ";
    var str = "   "+liner(20)+"\n"+bdr;
    for(var i = 0;i<parts.length;i++){
        str += parts[i] + " ";
        if(i>0&&i%10==0){
            str += "\n" +bdr; 
        }
    }
    return str+'\n  '+liner(40);
}
function formatList(list,named){
    var str = named;
    
    list.forEach( 
        (item,ind) => str += ("\n   "+(ind+1) + ". " + item));
    return str+"\n"; 
}

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
