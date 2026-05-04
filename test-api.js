const https = require('https');

const data = JSON.stringify({
  keywords: 'it',
  location: 'remote'
});

const options = {
  hostname: 'jooble.org',
  port: 443,
  path: '/api/db88128d6e708b2abb2a673f9333d5bd',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body.substring(0, 500)));
});

req.on('error', (error) => console.error(error));
req.write(data);
req.end();
