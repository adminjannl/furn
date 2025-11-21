const fs = require('fs');
const https = require('https');
require('dotenv').config();

const sql = fs.readFileSync('supabase/migrations/20251029_103934_import_22_tables.sql', 'utf8');

const data = JSON.stringify({ query: sql });

const options = {
  hostname: process.env.VITE_SUPABASE_URL.replace('https://', '').replace('http://', ''),
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'apikey': process.env.VITE_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
  }
};

console.log('Executing SQL migration...');
console.log('SQL size:', sql.length, 'characters\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✓ Migration executed successfully!');

      const https2 = require('https');
      const queryOptions = {
        hostname: options.hostname,
        port: 443,
        path: '/rest/v1/products?sku=like.TBL-MNM-%25&select=sku,name,price&order=sku',
        method: 'GET',
        headers: {
          'apikey': process.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
        }
      };

      const queryReq = https2.request(queryOptions, (queryRes) => {
        let queryData = '';
        queryRes.on('data', (chunk) => {queryData += chunk;});
        queryRes.on('end', () => {
          const products = JSON.parse(queryData);
          console.log(`\n✓ Found ${products.length} tables in database\n`);
          products.slice(0, 5).forEach(p => {
            console.log(`  - ${p.sku}: ${p.name.substring(0, 40)}... (${p.price} BYN)`);
          });
          if (products.length > 5) {
            console.log(`  ... and ${products.length - 5} more tables`);
          }
        });
      });
      queryReq.on('error', (e) => { console.error('Query error:', e.message); });
      queryReq.end();

    } else {
      console.error('Error:', res.statusCode, responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(data);
req.end();
