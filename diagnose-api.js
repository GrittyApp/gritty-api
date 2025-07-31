#!/usr/bin/env node

/**
 * Gritty App API Diagnostic Tool
 * 
 * Quick diagnostic to check API availability and response format
 * Usage: node diagnose-api.js [base_url]
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.argv[2] || 'https://gritty-staging.onrender.com/api/v1';

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Gritty-API-Diagnostic/1.0',
        ...headers
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          raw: responseData,
          data: responseData ? (() => {
            try {
              return JSON.parse(responseData);
            } catch (e) {
              return null;
            }
          })() : null
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function diagnoseAPI() {
  console.log('🔍 Gritty App API Diagnostic Tool');
  console.log(`📍 Testing: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Basic connectivity
    console.log('\n1️⃣ Testing Basic Connectivity...');
    try {
      const response = await makeRequest('GET', '/');
      console.log(`   Status: ${response.status}`);
      console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}`);
      console.log(`   Raw Response: ${response.raw.substring(0, 200)}${response.raw.length > 200 ? '...' : ''}`);
      console.log(`   Parsed JSON: ${response.data ? 'Yes' : 'No'}`);
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
    }
    
    // Test 2: Health check endpoint
    console.log('\n2️⃣ Testing Health Check Endpoint...');
    try {
      const response = await makeRequest('GET', '/health');
      console.log(`   Status: ${response.status}`);
      console.log(`   Raw Response: ${response.raw}`);
      console.log(`   Parsed Data:`, response.data);
    } catch (error) {
      console.log(`   ❌ Health check failed: ${error.message}`);
    }
    
    // Test 3: Try different health check paths
    console.log('\n3️⃣ Testing Alternative Health Check Paths...');
    const healthPaths = ['/health', '/healthz', '/status', '/ping', '/api/health'];
    
    for (const path of healthPaths) {
      try {
        const response = await makeRequest('GET', path);
        console.log(`   ${path}: ${response.status} - ${response.raw.substring(0, 100)}`);
      } catch (error) {
        console.log(`   ${path}: Error - ${error.message}`);
      }
    }
    
    // Test 4: Test root path without /api/v1
    console.log('\n4️⃣ Testing Root Domain...');
    try {
      const rootUrl = BASE_URL.replace('/api/v1', '');
      const url = new URL('/', rootUrl);
      const response = await makeRequest('GET', '/');
      console.log(`   Root Status: ${response.status}`);
      console.log(`   Root Response: ${response.raw.substring(0, 200)}`);
    } catch (error) {
      console.log(`   ❌ Root test failed: ${error.message}`);
    }
    
    // Test 5: Test authentication endpoint
    console.log('\n5️⃣ Testing Authentication Endpoint...');
    try {
      const response = await makeRequest('POST', '/auth/login', {
        user: { email: 'test@example.com', password: 'invalid' }
      });
      console.log(`   Auth Status: ${response.status}`);
      console.log(`   Auth Response: ${response.raw}`);
    } catch (error) {
      console.log(`   ❌ Auth test failed: ${error.message}`);
    }
    
    // Test 6: Check if it's a Rails app
    console.log('\n6️⃣ Checking if Rails Application...');
    try {
      const response = await makeRequest('GET', '/rails/info/routes');
      console.log(`   Rails Info: ${response.status} - ${response.raw.substring(0, 100)}`);
    } catch (error) {
      console.log(`   Rails Info: Not accessible or not Rails`);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('🏁 Diagnostic Complete');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('💥 Diagnostic failed:', error.message);
    process.exit(1);
  }
}

// Run diagnostic
if (require.main === module) {
  diagnoseAPI();
}
