require('dotenv').config();
var request = require('request');
var fs = require('fs');
var GITHUB_USER = "Ammarmasud";
var getRepoContributors = require('./download_avatars');
var recommendedRepos = {};



function getStarredRepos(oldBody, cb) {
  var body = JSON.parse(oldBody);
  var i = 0;

  // loop through json to acquire starred repos
  for (var user of body) {

    var userLogin = user['login'];

    // Includes User-agent header because it is required by the API
    var options = {
      url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/users/'+ userLogin +'/starred',
      headers: {"User-Agent": "GitHub Avatar Downloader - Student Project"}
    };

    request(options, function (err, response, starBody) {
      i++;
      for (var repo of JSON.parse(starBody)) {
        var repoName = repo['full_name']
        if (recommendedRepos[repoName]) {
          recommendedRepos[repoName] += 1;
        } else {
          recommendedRepos[repoName] = 1;
        }
      }

      if (i === body.length) {
        cb(recommendedRepos);
      }
    });
  };
}

function callback(repos) {
  var countOrdered = {}

  for (var key of Object.keys(repos)) {
    if (countOrdered[repos[key]]) {
      countOrdered[repos[key]].push(key);
    } else {
      countOrdered[repos[key]] = [key];
    }
  }
  counts = Object.keys(countOrdered);
  counts.sort(function(a, b){ return b - a });

  for (var count of counts.slice(0,counts.length-1)) {
    console.log(`[ ${count} stars ] ${countOrdered[count]}`);
  }
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
    console.log("Github API key not found. Insert into .env file or input as third command line argument.");
  }

  // Continues script if correct arguments passed
  getRepoContributors(process.argv[2], process.argv[3], function(err, response, body) {
    if (err) {
      console.log("Errors:", err);
    };

    getStarredRepos(body, callback);
  });

}