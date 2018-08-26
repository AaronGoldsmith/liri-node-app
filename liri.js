var dot = require('dotenv').config()
var keys = require('./keys.js');
var fs = require('fs')
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment')


// throw an error if there was an issue
// initializing the enviorment variables
if (dot.error) {
    throw result.error
}

// command variable
var cmd = process.argv[2];

// an array of user input
var cmdlist = process.argv;


// remove arguments index 0,1,2 (not needed)
cmdlist.splice(0,3); 
var urlArg = cmdlist.join(" ");

// switch statement on string passed through argv
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
                var shows = JSON.parse(body); // JSON -->  {keys:value}                
                console.log(shows.forEach(function(item){
                    var timestamp = moment(item.datetime).format("MM/DD/YYYY")

                    var vName = item.venue.name;
                    var vCity = item.venue.city;

                    // prioritize the region first
                    // than as a fall back it selects country
                    var vState = item.venue.region || item.venue.country;
                    
                    // ommit any shows where a required key is missing
                    if((!vName) || (!vState) || (!timestamp) ){ 
                        return; 
                    }
                    console.log(liner(7));
                    console.log("(" + timestamp + ")");
                    console.log(vName);
                    console.log(vCity + ", " + vState);
                    console.log(liner(7)+'\n');
                    
                }));
        }
    });
}

function spotifyThisSong(song){
    var spotify = new Spotify(keys.spotify);
    
    spotify
        .search({ type: 'track', query: song})
        .then(function(response) {
            // limiting the search to just top result
            var item = response.tracks.items[0];
            // format time
            var timeFrmt = moment(item.album.release_date,"YYYY-MM-DD").format("MM/DD/YYYY")
            console.log(item.name)
            console.log(timeFrmt);
            console.log(item.artists[0].name)

            // conditional check for the 30s preview url
            if(item.preview_url){console.log(item.preview_url)}
            else{console.log("  ~~> \""+item.name+"\" can not be previewed")}
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieThis(movie){
    // default movie if none selected
    movie = movie || "Mr. Nobody";

    var str= "";
    var queryUrl = "http://www.omdbapi.com/?t="+ movie +"&y=&plot=short&apikey=trilogy"
    request(queryUrl, function(error, response, body) {
        
        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);

            // formatted values 
            var formattedTitle = "\n\n\t["+movieObj.Title +"]\n";
            var measuredLine = "   "+liner(movieObj.Title.length)+"\n";
            var countryList = movieObj.Country.split(", ").join(", and ");
            var stars = formatList(movieObj.Actors.split(", "),"Starring:");

            str += formattedTitle;
            str += measuredLine;

            str += "Produced in: " + countryList;
            str +=" in " + movieObj.Year + "\n";
            str += stars;
            str += "\n";

            // Rotten tomatoes is choice #2 if it exists
            if(movieObj.Ratings.length>1){
                var src = movieObj.Ratings[1].Source;
                var rating = movieObj.Ratings[1].Value +"\n";

               str +=  (src+ " gave a rating of " +rating);
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
    var line = "~≈"
    return line.repeat(size)
}
function pretty(category,size){
    return "\n \t~ "+category+" ~\n "+ liner(size) +"\n"; 
}
function formatText(text){
    var parts = text.split(" ");
    var bord = " |     ";
    var str = "   "+liner(40)+"\n"+bord;
    for(var i = 0;i<parts.length;i++){
        str += parts[i] + " ";
        if(i>0&&i%10==0){
            str += "\n" +bord; 
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
