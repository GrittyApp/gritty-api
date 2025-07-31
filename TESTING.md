# Gritty App API Testing Suite

## Overview

This repository includes comprehensive testing tools for the Gritty App API, providing both automated testing scripts and Postman collections for manual and automated testing.

## 🧪 Test Coverage

### Core Functionality

- ✅ **Health Check** - API availability and basic response
- ✅ **Authentication Flow** - Registration, login, logout, token validation
- ✅ **User Management** - Profile operations and user statistics
- ✅ **Training System** - List, start, and complete training sessions
- ✅ **Assessment System** - Full assessment workflow from start to results
- ✅ **Error Handling** - 401, 404, 422 error responses
- ✅ **Performance** - Response time validation (< 5000ms)

### Test Types

- **Functional Tests** - Core API functionality
- **Integration Tests** - End-to-end workflows
- **Error Handling Tests** - Invalid inputs and edge cases
- **Performance Tests** - Response time monitoring
- **Security Tests** - Authentication and authorization

## 🚀 Quick Start

### Option 1: Automated Node.js Script

```bash
# Test against staging environment
node automated-api-test.js https://gritty-staging.onrender.com/api/v1

# Test against local development
node automated-api-test.js http://localhost:3000/api/v1

# Using npm scripts
npm run test:staging
npm run test:local
```

### Option 2: Postman Collection

1. **Import Collection**

   ```bash
   # Import the comprehensive test suite
   postman import gritty-api-test-suite.postman_collection.json
   ```

2. **Set Environment Variables**

   - `base_url`: Your API base URL
   - `test_email`: Email for test user (auto-generated if not set)
   - `test_password`: Password for test user

3. **Run Collection**
   - Use Postman Collection Runner
   - Or use Newman CLI: `npm run postman:test:staging`

### Option 3: Newman CLI (Automated Postman)

```bash
# Install Newman globally
npm install -g newman

# Run against staging
newman run gritty-api-test-suite.postman_collection.json \
  --env-var base_url=https://gritty-staging.onrender.com/api/v1 \
  --reporters cli,json \
  --reporter-json-export results.json

# Run with custom environment
newman run gritty-api-test-suite.postman_collection.json \
  --environment your-environment.json
```

## 📊 Test Results

### Node.js Script Output

```
🚀 Starting Gritty App API Test Suite
📍 Testing against: https://gritty-staging.onrender.com/api/v1
📧 Test user email: test-1643723456789@grittytest.com
============================================================

🏥 Testing Health Check...
✅ Health check returns 200
✅ Health check has success property
✅ Health check has status property

🔐 Testing Authentication Flow...
✅ User registration returns 201
✅ Registration response has user data
✅ Registration includes JWT token
✅ Login returns 200
✅ Login response has user and token
✅ Get current user returns 200
✅ Current user data is correct

============================================================
📊 TEST SUITE RESULTS
============================================================
⏱️  Total Duration: 12.3s
📈 Tests Run: 45
✅ Passed: 45
❌ Failed: 0
📊 Success Rate: 100.0%

🔍 Test Suite Results:
🏥 Health Check: ✅ PASS
🔐 Authentication: ✅ PASS
🏋️ Training System: ✅ PASS
📊 Assessment System: ✅ PASS
❌ Error Handling: ✅ PASS
🧹 Cleanup: ✅ PASS

🎉 All tests passed!
```

### Postman Collection Features

- **Pre-request Scripts** - Automatic token management
- **Test Scripts** - Comprehensive validation for each endpoint
- **Environment Variables** - Dynamic test data generation
- **Error Handling** - Proper validation of error responses
- **Progress Tracking** - Visual progress through test execution

## 🔧 Configuration

### Environment Variables

| Variable        | Description        | Example                                        |
| --------------- | ------------------ | ---------------------------------------------- |
| `base_url`      | API base URL       | `https://gritty-staging.onrender.com/api/v1`   |
| `test_email`    | Test user email    | `test@example.com` (auto-generated if not set) |
| `test_password` | Test user password | `TestPassword123!`                             |

### Test Configuration

```javascript
// automated-api-test.js configuration
const BASE_URL =
  process.argv[2] || "https://gritty-staging.onrender.com/api/v1";
const TEST_EMAIL = `test-${Date.now()}@grittytest.com`;
const TEST_PASSWORD = "TestPassword123!";
```

## 🎯 Test Scenarios

### 1. Complete User Journey

1. **Health Check** - Verify API is accessible
2. **User Registration** - Create new test user account
3. **User Login** - Authenticate and receive JWT token
4. **Get Current User** - Verify authentication works
5. **Browse Trainings** - List available training content
6. **Start Training** - Begin a training session
7. **Complete Training** - Finish training and earn points
8. **Browse Assessments** - List available assessments
9. **Take Assessment** - Complete full assessment workflow
10. **View Results** - Get assessment results and scores
11. **Check Stats** - View updated user statistics
12. **Logout** - Clean session termination

### 2. Error Handling Scenarios

- **404 Errors** - Non-existent resources
- **401 Errors** - Missing or invalid authentication
- **422 Errors** - Invalid request data
- **Validation Errors** - Field validation failures

### 3. Performance Scenarios

- **Response Time** - All requests under 5000ms
- **Concurrent Users** - Multiple test users simultaneously
- **Load Testing** - High volume request testing

## 🚨 Troubleshooting

### Common Issues

#### Authentication Failures

```bash
❌ User registration returns 201
```

**Solution**: Check if email already exists, use unique test emails

#### Network Timeouts

```bash
❌ Health check failed: ECONNREFUSED
```

**Solution**: Verify the base URL is correct and API is running

#### Token Expiration

```bash
❌ Get current user returns 200
```

**Solution**: Ensure token is properly stored and passed in headers

### Debug Mode

Enable verbose logging:

```javascript
// Add to automated-api-test.js
const DEBUG = process.env.DEBUG === "true";
if (DEBUG) {
  console.log("Request:", method, path, data);
  console.log("Response:", response);
}
```

Run with debug:

```bash
DEBUG=true node automated-api-test.js
```

## 📈 Continuous Integration

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16"
      - run: npm install
      - run: npm run test:staging
      - run: npm run postman:test:staging
```

### Test Reporting

- **Node.js Script**: Console output with summary statistics
- **Newman**: JSON, HTML, and CLI reporters available
- **Postman**: Built-in test result visualization

## 🔄 Maintenance

### Updating Tests

1. **Add New Endpoints**: Update both Node.js script and Postman collection
2. **Modify Existing Tests**: Ensure backwards compatibility
3. **Update Documentation**: Keep TESTING.md current with changes

### Test Data Management

- **Unique Test Users**: Auto-generated emails prevent conflicts
- **Cleanup**: Tests include logout and cleanup procedures
- **Isolation**: Each test run uses fresh test data

## 📞 Support

For issues with the test suite:

1. **Check Logs**: Review console output for specific error messages
2. **Verify Environment**: Ensure correct base URL and credentials
3. **Update Tests**: Pull latest version from repository
4. **Report Issues**: Create GitHub issue with test output

## 🎯 Best Practices

1. **Run Tests Regularly** - Before deployments and after changes
2. **Monitor Performance** - Watch for response time degradation
3. **Update Test Data** - Keep test scenarios realistic
4. **Validate Results** - Don't just check status codes, validate data
5. **Clean Up** - Always logout and clean test data
