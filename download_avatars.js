var request = require('request');
var fs = require('fs');
var GITHUB_USER = "Ammarmasud";
var GITHUB_TOKEN = require("./github_token");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = { url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
                  headers: {"User-Agent":"GitHub Avatar Downloader - Student Project"}
  }
  request(options, cb);
}


function downloadImageByURL(url, filePath) {
  request.get(url)
            .pipe(fs.createWriteStream('./' + filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function(err, response, body) {
  for (var user of JSON.parse(body)) {
    downloadImageByURL(user['avatar_url'], `avatars/${user['login']}.jpg`)
  }
});
