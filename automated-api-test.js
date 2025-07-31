#!/usr/bin/env node

/**
 * Gritty App API Automated Test Suite
 * 
 * Standalone Node.js script to test the complete API workflow
 * Usage: node automated-api-test.js [base_url]
 * 
 * Example: node automated-api-test.js https://beta1-gritty-app.onrender.com/api/v1
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BASE_URL = process.argv[2] || 'https://gritty-staging.onrender.com/api/v1';
const TEST_EMAIL = `test-${Date.now()}@grittytest.com`;
const TEST_PASSWORD = 'TestPassword123!';

// Test state
let testState = {
  token: null,
  userId: null,
  trainingId: null,
  assessmentId: null,
  userAssessmentId: null,
  userTrainingId: null
};

// Test results tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// Utility functions
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
        'User-Agent': 'Gritty-API-Test-Suite/1.0',
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
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData,
            raw: responseData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: responseData,
            parseError: error.message
          });
        }
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

function test(name, testFn) {
  testResults.total++;
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      testResults.passed++;
      return true;
    } else {
      console.log(`❌ ${name}`);
      testResults.failed++;
      testResults.errors.push(name);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`${name}: ${error.message}`);
    return false;
  }
}

function expect(actual) {
  return {
    toBe: (expected) => actual === expected,
    toEqual: (expected) => JSON.stringify(actual) === JSON.stringify(expected),
    toBeGreaterThan: (expected) => actual > expected,
    toBeLessThan: (expected) => actual < expected,
    toContain: (expected) => actual && actual.includes && actual.includes(expected),
    toHaveProperty: (prop) => actual && actual.hasOwnProperty(prop),
    toBeArray: () => Array.isArray(actual),
    toBeString: () => typeof actual === 'string',
    toBeNumber: () => typeof actual === 'number'
  };
}

// Test suites
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  
  try {
    const response = await makeRequest('GET', '/health');
    
    test('Health check returns 200', () => expect(response.status).toBe(200));
    test('Health check has success property', () => expect(response.data.success).toBe(true));
    test('Health check has status property', () => expect(response.data.status).toBe(200));
    
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication Flow...');
  
  try {
    // Register new user
    const registerData = {
      user: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        password_confirmation: TEST_PASSWORD,
        first_name: 'Test',
        last_name: 'User',
        date_of_birth: '2005-01-01',
        sport: 'Basketball'
      }
    };
    
    const registerResponse = await makeRequest('POST', '/auth/register', registerData);
    
    test('User registration returns 201', () => expect(registerResponse.status).toBe(201));
    test('Registration response has user data', () => 
      expect(registerResponse.data.data).toHaveProperty('user') &&
      expect(registerResponse.data.data.user).toHaveProperty('id')
    );
    test('Registration includes JWT token', () => 
      expect(registerResponse.data.data).toHaveProperty('token') &&
      expect(registerResponse.data.data.token).toBeString()
    );
    
    if (registerResponse.status === 201) {
      testState.token = registerResponse.data.data.token;
      testState.userId = registerResponse.data.data.user.id;
    }
    
    // Login with credentials
    const loginData = {
      user: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      }
    };
    
    const loginResponse = await makeRequest('POST', '/auth/login', loginData);
    
    test('Login returns 200', () => expect(loginResponse.status).toBe(200));
    test('Login response has user and token', () => 
      expect(loginResponse.data.data).toHaveProperty('user') &&
      expect(loginResponse.data.data).toHaveProperty('token')
    );
    
    // Get current user
    const meResponse = await makeRequest('GET', '/auth/me', null, {
      'Authorization': `Bearer ${testState.token}`
    });
    
    test('Get current user returns 200', () => expect(meResponse.status).toBe(200));
    test('Current user data is correct', () => 
      expect(meResponse.data.data.user.email).toBe(TEST_EMAIL)
    );
    
    return registerResponse.status === 201 && loginResponse.status === 200;
  } catch (error) {
    console.log(`❌ Authentication test failed: ${error.message}`);
    return false;
  }
}

async function testTrainingSystem() {
  console.log('\n🏋️ Testing Training System...');
  
  if (!testState.token) {
    console.log('❌ Skipping training tests - no authentication token');
    return false;
  }
  
  try {
    const authHeaders = { 'Authorization': `Bearer ${testState.token}` };
    
    // Get available trainings
    const trainingsResponse = await makeRequest('GET', '/trainings', null, authHeaders);
    
    test('Get trainings returns 200', () => expect(trainingsResponse.status).toBe(200));
    test('Trainings response has array', () => 
      expect(trainingsResponse.data.data).toHaveProperty('trainings') &&
      expect(trainingsResponse.data.data.trainings).toBeArray()
    );
    
    if (trainingsResponse.data.data.trainings.length > 0) {
      testState.trainingId = trainingsResponse.data.data.trainings[0].id;
      
      // Get training details
      const trainingResponse = await makeRequest('GET', `/trainings/${testState.trainingId}`, null, authHeaders);
      
      test('Get training details returns 200', () => expect(trainingResponse.status).toBe(200));
      test('Training details structure', () => 
        expect(trainingResponse.data.data).toHaveProperty('training') &&
        expect(trainingResponse.data.data.training).toHaveProperty('id')
      );
      
      // Start training session
      const startResponse = await makeRequest('POST', `/trainings/${testState.trainingId}/start`, {}, authHeaders);
      
      test('Start training returns 201', () => expect(startResponse.status).toBe(201));
      test('Training session created', () => 
        expect(startResponse.data.data).toHaveProperty('user_training') &&
        expect(startResponse.data.data.user_training).toHaveProperty('status')
      );
      
      if (startResponse.status === 201) {
        testState.userTrainingId = startResponse.data.data.user_training.id;
      }
    }
    
    return trainingsResponse.status === 200;
  } catch (error) {
    console.log(`❌ Training system test failed: ${error.message}`);
    return false;
  }
}

async function testAssessmentSystem() {
  console.log('\n📊 Testing Assessment System...');

  if (!testState.token) {
    console.log('❌ Skipping assessment tests - no authentication token');
    return false;
  }

  try {
    const authHeaders = { 'Authorization': `Bearer ${testState.token}` };

    // Get available assessments
    const assessmentsResponse = await makeRequest('GET', '/assessments', null, authHeaders);

    test('Get assessments returns 200', () => expect(assessmentsResponse.status).toBe(200));
    test('Assessments response has array', () =>
      expect(assessmentsResponse.data.data).toHaveProperty('assessments') &&
      expect(assessmentsResponse.data.data.assessments).toBeArray()
    );

    if (assessmentsResponse.data.data.assessments.length > 0) {
      testState.assessmentId = assessmentsResponse.data.data.assessments[0].id;

      // Start new assessment
      const startData = { assessment_id: testState.assessmentId };
      const startResponse = await makeRequest('POST', '/user_assessments', startData, authHeaders);

      test('Start assessment returns 201', () => expect(startResponse.status).toBe(201));
      test('Assessment session created', () =>
        expect(startResponse.data.data).toHaveProperty('user_assessment') &&
        expect(startResponse.data.data.user_assessment).toHaveProperty('id')
      );

      if (startResponse.status === 201) {
        testState.userAssessmentId = startResponse.data.data.user_assessment.id;

        // Submit sample responses
        const responsesData = {
          responses: [
            { question_id: 1, value: 4 },
            { question_id: 2, value: 3 },
            { question_id: 3, value: 5 },
            { question_id: 4, value: 4 },
            { question_id: 5, value: 3 }
          ]
        };

        const progressResponse = await makeRequest('POST', `/user_assessments/${testState.userAssessmentId}/progress`, responsesData, authHeaders);

        test('Submit responses returns 200', () => expect(progressResponse.status).toBe(200));
        test('Progress response structure', () =>
          expect(progressResponse.data.data).toHaveProperty('progress')
        );
      }
    }

    return assessmentsResponse.status === 200;
  } catch (error) {
    console.log(`❌ Assessment system test failed: ${error.message}`);
    return false;
  }
}

async function testErrorHandling() {
  console.log('\n❌ Testing Error Handling...');

  try {
    // Test 404 - Non-existent resource
    const notFoundResponse = await makeRequest('GET', '/trainings/99999', null, {
      'Authorization': `Bearer ${testState.token}`
    });

    test('Non-existent resource returns 404', () => expect(notFoundResponse.status).toBe(404));
    test('404 error response structure', () =>
      expect(notFoundResponse.data).toHaveProperty('error') &&
      expect(notFoundResponse.data).toHaveProperty('status')
    );

    // Test 401 - Missing authorization
    const unauthorizedResponse = await makeRequest('GET', '/trainings');

    test('Missing auth returns 401', () => expect(unauthorizedResponse.status).toBe(401));
    test('Auth error response structure', () =>
      expect(unauthorizedResponse.data).toHaveProperty('error') &&
      expect(unauthorizedResponse.data).toHaveProperty('status')
    );

    // Test 422 - Invalid data
    const invalidData = {
      user: {
        email: 'invalid-email',
        password: '123'
      }
    };

    const validationResponse = await makeRequest('POST', '/auth/register', invalidData);

    test('Invalid data returns 422', () => expect(validationResponse.status).toBe(422));
    test('Validation error response structure', () =>
      expect(validationResponse.data).toHaveProperty('error') &&
      expect(validationResponse.data).toHaveProperty('status')
    );

    return true;
  } catch (error) {
    console.log(`❌ Error handling test failed: ${error.message}`);
    return false;
  }
}

async function testCleanup() {
  console.log('\n🧹 Testing Cleanup & Final Operations...');

  if (!testState.token) {
    console.log('❌ Skipping cleanup tests - no authentication token');
    return false;
  }

  try {
    const authHeaders = { 'Authorization': `Bearer ${testState.token}` };

    // Get user stats
    const statsResponse = await makeRequest('GET', `/users/${testState.userId}/stats`, null, authHeaders);

    test('Get user stats returns 200', () => expect(statsResponse.status).toBe(200));
    test('User stats structure', () =>
      expect(statsResponse.data.data).toHaveProperty('stats') &&
      expect(statsResponse.data.data.stats).toHaveProperty('total_points')
    );

    // Logout
    const logoutResponse = await makeRequest('POST', '/auth/logout', {}, authHeaders);

    test('Logout returns 200', () => expect(logoutResponse.status).toBe(200));
    test('Logout response structure', () =>
      expect(logoutResponse.data).toHaveProperty('success') &&
      expect(logoutResponse.data.success).toBe(true)
    );

    return statsResponse.status === 200 && logoutResponse.status === 200;
  } catch (error) {
    console.log(`❌ Cleanup test failed: ${error.message}`);
    return false;
  }
}

// Main execution function
async function runAllTests() {
  console.log('🚀 Starting Gritty App API Test Suite');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`📧 Test user email: ${TEST_EMAIL}`);
  console.log('=' .repeat(60));

  const startTime = Date.now();

  try {
    // Run all test suites
    const healthResult = await testHealthCheck();
    const authResult = await testAuthentication();
    const trainingResult = await testTrainingSystem();
    const assessmentResult = await testAssessmentSystem();
    const errorResult = await testErrorHandling();
    const cleanupResult = await testCleanup();

    // Calculate results
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);

    // Print final report
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUITE RESULTS');
    console.log('=' .repeat(60));
    console.log(`⏱️  Total Duration: ${duration}s`);
    console.log(`📈 Tests Run: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Success Rate: ${successRate}%`);

    // Test suite results
    console.log('\n🔍 Test Suite Results:');
    console.log(`🏥 Health Check: ${healthResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔐 Authentication: ${authResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🏋️ Training System: ${trainingResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📊 Assessment System: ${assessmentResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`❌ Error Handling: ${errorResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🧹 Cleanup: ${cleanupResult ? '✅ PASS' : '❌ FAIL'}`);

    // Failed tests details
    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }

    // Environment info
    console.log('\n🔧 Environment Info:');
    console.log(`   • Base URL: ${BASE_URL}`);
    console.log(`   • Test Email: ${TEST_EMAIL}`);
    console.log(`   • User ID: ${testState.userId || 'N/A'}`);
    console.log(`   • Training ID: ${testState.trainingId || 'N/A'}`);
    console.log(`   • Assessment ID: ${testState.assessmentId || 'N/A'}`);

    // Exit with appropriate code
    const exitCode = testResults.failed > 0 ? 1 : 0;
    console.log(`\n${exitCode === 0 ? '🎉 All tests passed!' : '💥 Some tests failed!'}`);
    console.log('=' .repeat(60));

    process.exit(exitCode);

  } catch (error) {
    console.error('\n💥 Test suite crashed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Performance monitoring
function logPerformance(testName, startTime) {
  const duration = Date.now() - startTime;
  if (duration > 3000) {
    console.log(`⚠️  Slow response: ${testName} took ${duration}ms`);
  }
}

// Utility for retrying failed requests
async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`⚠️  Request failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Test suite interrupted by user');
  console.log('📊 Partial Results:');
  console.log(`   Tests Run: ${testResults.total}`);
  console.log(`   Passed: ${testResults.passed}`);
  console.log(`   Failed: ${testResults.failed}`);
  process.exit(130);
});

process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Run the test suite
if (require.main === module) {
  runAllTests();
}
