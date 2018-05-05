const request = require('request');

// check for proper usage
if (process.argv.length !== 4) {
  console.log('Incorrect usage');
  process.exit(1);
}

let username = process.argv[2];
let password = process.argv[3];

// headers for login attempt
let headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Origin': 'https://connect.exeter.edu',
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9'
};
// data for login attempt, including username and password
var dataString = 'curl=Z2F&flags=0&forcedownlevel=0&formdir=3&trusted=0&username=' + username + '&password=' + password + '&SubmitCreds=Log+On';

var options = {
    url: 'https://connect.exeter.edu/CookieAuth.dll?Logon',
    method: 'POST',
    headers: headers,
    body: dataString
};

// callback for after login request
// use the cookie returned and test whether we can access connect.exeter.edu with it
function callback(error, response, body) {
  // make sure we got the expected 302 status code
  if (error || response.statusCode !== 302) {
    console.log('An unexpected error occurred while logging in:');
    console.log('Status code: ' + response.statusCode);
    console.log('Error:');
    console.log(error);
    process.exit(1);
  }
  let setCookieString = response.headers['set-cookie'][0];
  let shortenedString = setCookieString.substring(setCookieString.indexOf('"') + 1);
  let cookieString = shortenedString.substring(0, shortenedString.indexOf('"'));

  // headers for access connect.exeter.edu website
  var headers2 = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'cadataEE4350E484924E96A516CE55992E10E9=' + cookieString
  };
  var options2 = {
    url: 'https://connect.exeter.edu/',
    headers: headers2
  };
  
  // callback for after trying cookie
  function callback2(error, response, body) {
    // check for 2 of the fields which are sent on the response headers when the cookie is valid
    // if both are there, this seems to have been successful
    // otherwise, it wasn't successful
    if ('expires' in response.headers && 'date' in response.headers) {
      console.log('Successful login');
    }
    else {
      console.log('Unsuccessful login.');
    }
  }

  request(options2, callback2);
}

request(options, callback);
