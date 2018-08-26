# liri-node-app
 LIRI is a command line Node.js application run from the terminal.

 The user may enter in a variety of different different commands, but can only get one result at a time.
 
### How to use
 Clone down repo and using node package manager, `npm install` the listed packages into the root directory of the project.

Packages required:
 * `fs` - file system
 * `node-spotify-api` - Spotify
 * `request` - Make requests through http
 * `moment` - Used for correctly formatting dates

The node application can take in 1 of 4 commands
  - `concert-this  <band> ` - Takes in one argument, the name of the band.
  - `spotify-this-song <song>` -  expects the title of a song and will return information along witha a 30s preview
  - `movie-this <movie>` - Expects a movie title, and will return the plot summary along with actors, year, etc
  - `do-what-it-says` - takes in no arguments, but expects a text file called "random.txt" to include the function and its respective parameter


### Continued Development:
  - Adding in functionality to save user input/history in a separate text file
  - If an artist has a newer version of an old song, it will give the most recent version not OG
