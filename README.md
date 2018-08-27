# liri-node-app
 LIRI is a command line Node.js application run from the terminal.

 The user may enter in a variety of different different commands, but can only get one result at a time.
 
### How to use
 Clone down repo and using node package manager, `npm install` the listed packages into the root directory of the project.

#### Node Packages:
 |Package|Purpose|Link|
 |---|---|---|
 | `fs` | file system integration | [nodejs.org/api/fs](https://nodejs.org/api/fs.html)
 | `dotenv`| set enviornment variables|
 | `node-spotify-api` | Spotify API| [npmjs.com/package/node-spotify-api](https://www.npmjs.com/package/node-spotify-api)
 | `request` | Makes calls through http | [npmjs.com/package/request](https://www.npmjs.com/package/request) |
 | `moment` | Formats date/time | [npmjs.com/package/moment](https://www.npmjs.com/package/moment)

The node application can take in 1 of 4 commands
  - `concert-this  <band> ` - Takes in one argument, the name of the band.
  - `spotify-this-song <song>` -  expects the title of a song and will return information along witha a 30s preview
  - `movie-this <movie>` - Expects a movie title, and will return the plot summary along with actors, year, etc
  - `do-what-it-says` - takes in no arguments, but expects a text file called "random.txt" to include the function and its respective parameter


### Continued Development:
  - Adding in functionality to save user input/history in a separate text file
  - If an artist has a newer version of an old song, it will give the most recent version not OG


### Getting Started
*Make sure that all packages have been installed prior to running the code*

```javascript
// enables using hidden global variables
var dot = require('dotenv').config()

// link variables .env file
require('./keys.js'); 

// file system
require('fs')

// node packages
require('node-spotify-api');
require('request');
require('moment')
```

### Troubleshooting
Make sure that `keys.js` is in the root directory 
```javascript
// keys.js

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
};
```

### Things to try:
 <!-- - Pipe the output through the less function -->

