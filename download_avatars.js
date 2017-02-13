var request = require('request');
var GITHUB_USER = "Ammarmasud";
var GITHUB_TOKEN = require("./github_token");

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  request.get(requestURL)
          .on('response', function (response) {
            response.on('end', function () {
              console.log(response)
            });
          });

}


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});