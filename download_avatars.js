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

// getRepoContributors("jquery", "jquery", function(err, response, body) {
//   // console.log("Errors:", err);
//   // console.log("Response:", response);
//   for (var user of JSON.parse(body)) {
//     console.log(user['avatar_url']);
//   }
// });

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")