const https = require('https');
const fs = require('fs');
require('dotenv').config();

const functionCode = fs.readFileSync('./supabase/functions/ashley-scraper/index.ts', 'utf8');

const deployData = JSON.stringify({
  slug: 'ashley-scraper',
  verify_jwt: false,
  files: [
    {
      name: 'index.ts',
      content: functionCode
    }
  ]
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)[1];

console.log(`\nDeploying ashley-scraper to project ${projectRef}...\n`);

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${projectRef}/functions/ashley-scraper`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': deployData.length,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}\n`);
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✓ Deployed successfully!');
    } else {
      console.log('✗ Deployment failed');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(deployData);
req.end();
