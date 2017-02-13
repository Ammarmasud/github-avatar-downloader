var request = require('request');
var fs = require('fs');
var GITHUB_USER = "Ammarmasud";
var GITHUB_TOKEN = require("./github_token");

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
  request.get(url).pipe(fs.createWriteStream('./' + filePath));
}

// Check if the correct number of arguments were given
if (process.argv.length !== 4) {
  console.log("Wrong number of arguments pass. Two arguments required: <Github repo owner> and <Github repo name>");
} else {
  // Continues script if correct arguments passed
  getRepoContributors(process.argv[2], process.argv[3], function(err, response, body) {
    for (var user of JSON.parse(body)) {
      downloadImageByURL(user['avatar_url'], `avatars/${user['login']}.jpg`);
    }
  });
}