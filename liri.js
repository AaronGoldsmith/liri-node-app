/* Node Packages  */
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

// values passed in through stdin
var cmd = process.argv[2];
var cmdlist = process.argv;

/* 
    splicing out elements in process.argv 3 to its length
     care about keeping our query request
*/
var urlArg = cmdlist.splice(3,cmdlist.length)

// setup default here
if(urlArg.length>0){
    urlArg.join(" ");
}else{
    if(cmd=='spotify-this-song'){
        urlArg="The Sign, Ace Of Base"
    }
}

// use a switch statement to determine which command was passed in
switch(cmd){
   case("concert-this"): concertThis(urlArg); break; // call concert function 
   case("spotify-this-song"): spotifyThisSong(urlArg); break; // call a spotify function
   case("movie-this"): movieThis(urlArg); break; // call the movie function
   case("do-what-it-says"): followDirections(); break; // does another function
   default: console.log("<ERROR>: Invalid command given"); break;
}

function concertThis(artist){
    artist = artist.join(" ")
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryUrl,function(error, response, body) {

        /* On a succesful response */
        if (!error && response.statusCode === 200) {
            //  returns JSON objects, parse into JS obj
    
                var shows = JSON.parse(body); 
                debugger;
                shows.forEach(function(item){
                    // Moment API
                    var timestamp = moment(item.datetime).format("MM/DD/YYYY")

                    var vName = item.venue.name;
                    var vCity = item.venue.city;

                    // prioritize the region first
                    // if it can't find region, it selects country as a backup
                    var vState = item.venue.region || item.venue.country;
                    
                    // 
                    var location = vName + "\n" + vCity+ ", " + vState;
                    // ommit any shows where a required key is missing
                    if((!vName) || (!vState) || (!timestamp) ){ 
                        return; 
                    }
                    var complete = (liner(7)+timestamp+"\n"+location +"\n");

                    console.log(complete);
                });
        }
    });
}

function spotifyThisSong(song){
    // load the keys into spotify variable
    var spotify = new Spotify(keys.spotify);
    var str = "";
    spotify
        .search({ type: 'track', query: song})
        .then(function(response) {
            // Limit the search to just a single result
            var item = response.tracks.items[0];
            
            // Using Moment.js API - format date
            var timeFrmt = moment(item.album.release_date,"YYYY-MM-DD").format("MM/DD/YYYY")
            var songName = item.name;
            var artist = item.artists[0].name;
           
            str += (liner(20)+songName + "\n" + timeFrmt + "\n" + artist +"\n")
            
            // conditional check for the 30s preview url

            if(item.preview_url){
                str+=item.preview_url}
            else{
                str+= "  ~~> \""+item.name+"\" can not be previewed\n\n";
            }
            str += liner(20);
            console.log(str);

        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieThis(movie){
    // Sets a default movie if none was given
    movie = movie || "Mr. Nobody";

    var str= "";
    var queryUrl = "http://www.omdbapi.com/?t="+ movie +"&y=&plot=short&apikey=trilogy"
    request(queryUrl, function(error, response, body) {
        
        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);

            // formatted values 
            var formattedTitle = "\n\n\t["+movieObj.Title +"]\n";
            var measuredLine = liner(movieObj.Title.length,"  ");
            var countryList = movieObj.Country.split(", ").join(", and ");
            var stars = formatList(movieObj.Actors.split(", "),"Starring:");

            str += formattedTitle;
            str += measuredLine;

            str += "Produced in: " + countryList;
            str +=" in " + movieObj.Year + "\n";
            str += stars +"\n";

            // Rotten tomatoes is choice #2 if it exists
            if(movieObj.Ratings.length>1){
                var src = movieObj.Ratings[1].Source;
                var rating = movieObj.Ratings[1].Value +"\n";

               str +=  (src+ " gave a rating of " +rating);
            }
            str += "IMDB rates it a: " + movieObj.imdbRating+ "\n";

         
            str += "Produced in: " +movieObj.Country + "\n";
            str += "Lang: "+movieObj.Language+ "\n";

             // adding line breaks
            str += formatBlock(movieObj.Plot)
        }
        console.log(str);
      });
      return 0;
}


function followDirections(){
    fs.readFile("random.txt","utf8",function(error,data){
        if(error){return;}
        var parts = data.split(",");
        // check which word was given first in the text file
        // pass in second value as argument to function
        switch(parts[0]){
         case("concert-this"): concertThis(parts[1]); break; // call concert function 
         case("spotify-this-song"): spotifyThisSong(parts[1]); break; // call a spotify function
         case("movie-this"): movieThis(parts[1]); break; // call the movie function
         case("do-what-it-says"): followDirections(); break; // does another function
         default: console.log("<ERROR>: Invalid command given"); break;
      }
    })
 }

/* HELPERS FUNCTIONS FOR FORMATTING */
var liner = function(size,space){
    var line = "~≈"
    var spaced = space || "";
    return "\n"+spaced+line.repeat(size)+"\n"
}

function formatBlock(text){
    var parts = text.split(" ");
    var bdr = " |     ";
    var str = "   "+liner(40,"  ")+bdr;
    for(var i = 0;i<parts.length;i++){
        str += parts[i] + " ";
        if(i>0&&i%10==0){
            str += "\n" +bdr; 
        }
    }
    return str+liner(40,"  ");
}
function formatList(list,named){
    var str = named;
    
    list.forEach( (item,ind) => 
            str += ("\n   "+(ind+1) + ". " + item));
    return str+"\n"; 
}


