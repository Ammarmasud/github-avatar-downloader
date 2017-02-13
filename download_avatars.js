require('dotenv').config();
var request = require('request');
var fs = require('fs');
var GITHUB_USER = "Ammarmasud";


console.log('Welcome to the GitHub Avatar Downloader!');

// retreives JSON from github API of contributers
function getRepoContributors(repoOwner, repoName, cb) {
  // Includes User-agent header because it is required by the API
  var options = {
    url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {"User-Agent": "GitHub Avatar Downloader - Student Project"}
  }
  request(options, cb);
}

// downloades images then pipes them to appropriate folder
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) { throw err; })
    .pipe(fs.createWriteStream('./' + filePath));
}


// Check if the correct number of arguments were given
if (process.argv.length !== 4 && process.argv.length !== 5) {
  console.log(`Wrong number of arguments. Following arguments required...
    Argument 1: <Github repo owner>
    Argument 2: <Github repo name>
    Optional argument 3: <Github API token>`);

} else {
  // check if github api token was given
  if (process.argv.length === 5) {
    var GITHUB_TOKEN = process.argv[4];
  } else if (process.env.GITHUB_TOKEN) {
    var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  } else {
    console.log("Github API key not found. Insert into .env file or input as third command line argument.")
  }

  // Check if avatars directory exists, make it otherwise
  if (!fs.existsSync('./avatars')){
    fs.mkdirSync('./avatars');
  }

  // Continues script if correct arguments passed
  getRepoContributors(process.argv[2], process.argv[3], function(err, response, body) {
    if (err) {
      console.log("Errors:", err);
    }

    // loop through jason to download avatar for each user
    for (var user of JSON.parse(body)) {
      downloadImageByURL(user['avatar_url'], `avatars/${user['login']}.jpg`);
    }
  });
}