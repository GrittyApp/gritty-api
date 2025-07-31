# Gritty-API Repository Integration Guide

## 📋 Overview for Gritty-App Development Team

This document provides comprehensive information about the **gritty-api** repository and how it integrates with the main **gritty-app** repository for API documentation and testing.

## 🏗️ Repository Structure

### **gritty-api Repository** (https://github.com/GrittyApp/gritty-api)
```
gritty-api/
├── README.md                           # Main API documentation
├── openapi.yaml                        # OpenAPI 3.0.3 specification
├── gritty-api.postman_collection.json  # Original Postman collection
├── gritty-api-test-suite.postman_collection.json  # Comprehensive test suite
├── automated-api-test.js               # Standalone Node.js test script
├── package.json                        # NPM configuration and scripts
├── MAINTENANCE.md                      # Maintenance guidelines
├── TESTING.md                          # Testing documentation
├── GRITTY-APP-INTEGRATION.md          # This integration guide
└── .gitignore                          # Git ignore rules
```

## 🎯 Purpose and Objectives

### **Primary Goals**
1. **Single Source of Truth** - Centralized API documentation
2. **Backwards Compatibility** - Ensure API changes don't break existing clients
3. **Automated Testing** - Comprehensive test coverage for all API endpoints
4. **Documentation Sync** - Keep docs current with gritty-app changes
5. **Quality Assurance** - Validate API functionality before deployments

### **Target Audiences**
- **Mobile App Developers** - Using the API for iOS/Android apps
- **Frontend Developers** - Integrating with web interfaces
- **QA Engineers** - Testing API functionality
- **DevOps Teams** - Monitoring API health and performance
- **External Partners** - Third-party integrations

## 🔄 Integration with Gritty-App Repository

### **Monitoring Changes in gritty-app**
The gritty-api repository should be updated when changes occur in:

#### **Controllers** (`app/controllers/api/v1/`)
- **New endpoints** - Add to OpenAPI spec and test suite
- **Modified endpoints** - Update parameters, responses, validation
- **Removed endpoints** - Mark as deprecated, plan version migration
- **Authentication changes** - Update security schemes

#### **Routes** (`config/routes.rb`)
- **API route additions** - Document new endpoints
- **Route modifications** - Update path parameters
- **Namespace changes** - Update base paths

#### **Models** (API-relevant models)
- **Response structure changes** - Update OpenAPI schemas
- **Validation rule changes** - Update request/response examples
- **Relationship changes** - Update nested object structures

#### **Serializers** (`app/serializers/` if used)
- **Field additions/removals** - Update response schemas
- **Data format changes** - Update examples and validation

### **Sync Process Workflow**

#### **Manual Process (Current)**
1. **Monitor gritty-app changes** via git commits, PRs, releases
2. **Identify API-relevant changes** in controllers, routes, models
3. **Update gritty-api documentation**:
   - Modify `openapi.yaml` with new/changed endpoints
   - Update Postman collections with examples
   - Update `README.md` with endpoint counts and descriptions
4. **Test changes** against staging environment
5. **Commit and push** to gritty-api repository

#### **Automated Process (Planned)**
- **Git deploy action** will automatically sync changes
- **CI/CD integration** for validation and testing
- **Webhook notifications** for documentation updates

## 🧪 Testing Infrastructure

### **Test Suite Components**

#### **1. Comprehensive Postman Collection**
- **File**: `gritty-api-test-suite.postman_collection.json`
- **Coverage**: 48 endpoints across 8 categories
- **Features**:
  - Automated authentication flow
  - Dynamic test data generation
  - Error handling validation
  - Performance monitoring
  - Response structure validation

#### **2. Standalone Node.js Test Script**
- **File**: `automated-api-test.js`
- **Features**:
  - Zero dependencies (pure Node.js)
  - Command-line interface
  - Detailed reporting with success rates
  - Environment configuration
  - Error handling and retry logic

#### **3. NPM Scripts for Different Environments**
```bash
npm run test:staging    # Test against staging
npm run test:local      # Test against local development
npm run test:production # Test against production
npm run postman:test:staging # Run Postman via Newman
```

### **Test Coverage Areas**
- ✅ **Authentication Flow** - Register, login, logout, token validation
- ✅ **User Management** - Profile operations, statistics
- ✅ **Training System** - List, start, complete training sessions
- ✅ **Assessment System** - Full assessment workflow with results
- ✅ **Achievements & Rewards** - Points, badges, redemption
- ✅ **Notifications** - List, read, delete notifications
- ✅ **Teams & Social** - Team operations and leaderboards
- ✅ **Error Handling** - 401, 404, 422 error responses
- ✅ **Performance** - Response time monitoring (< 5000ms)

## 🚀 GitHub Actions Integration

### **Recommended Workflow for gritty-app Repository**

#### **1. API Documentation Sync Action**
```yaml
name: Sync API Documentation
on:
  push:
    branches: [main, develop]
    paths:
      - 'app/controllers/api/**'
      - 'config/routes.rb'
      - 'app/models/**'
      - 'app/serializers/**'

jobs:
  sync-api-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gritty-app
        uses: actions/checkout@v3
        
      - name: Checkout gritty-api
        uses: actions/checkout@v3
        with:
          repository: GrittyApp/gritty-api
          token: ${{ secrets.GITHUB_TOKEN }}
          path: gritty-api
          
      - name: Generate OpenAPI spec
        run: |
          # Extract API documentation from Rails app
          # Update gritty-api/openapi.yaml
          
      - name: Update Postman collection
        run: |
          # Update test collections with new endpoints
          
      - name: Commit and push changes
        run: |
          cd gritty-api
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add .
          git commit -m "Auto-sync: Update API docs from gritty-app@${{ github.sha }}"
          git push
```

#### **2. API Testing Action**
```yaml
name: API Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gritty-api
        uses: actions/checkout@v3
        with:
          repository: GrittyApp/gritty-api
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Wait for staging deployment
        run: |
          # Wait for staging environment to be ready
          
      - name: Run API tests
        run: npm run test:staging
        
      - name: Run Postman tests
        run: npm run postman:test:staging
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: api-test-results
          path: test-results/
```

### **3. Deployment Validation Action**
```yaml
name: Validate Deployment
on:
  deployment_status:

jobs:
  validate-api:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gritty-api
        uses: actions/checkout@v3
        with:
          repository: GrittyApp/gritty-api
          
      - name: Test deployed API
        run: |
          ENVIRONMENT=${{ github.event.deployment.environment }}
          if [ "$ENVIRONMENT" = "staging" ]; then
            npm run test:staging
          elif [ "$ENVIRONMENT" = "production" ]; then
            npm run test:production
          fi
```

## 🔧 Environment Configuration

### **Staging Environment**
- **URL**: `https://gritty-staging.onrender.com/api/v1`
- **Purpose**: Pre-production testing and validation
- **Test Frequency**: After every deployment
- **Test Suite**: Full comprehensive testing

### **Production Environment**
- **URL**: `https://api.grittyapp.com/api/v1`
- **Purpose**: Live API monitoring and health checks
- **Test Frequency**: Health checks only (non-destructive)
- **Test Suite**: Limited to read-only operations

### **Local Development**
- **URL**: `http://localhost:3000/api/v1`
- **Purpose**: Developer testing during development
- **Test Frequency**: On-demand during development
- **Test Suite**: Full testing with local test data

## 📊 Quality Assurance Process

### **Pre-Deployment Checklist**
- [ ] **API changes documented** in gritty-api repository
- [ ] **OpenAPI spec updated** with new/changed endpoints
- [ ] **Postman collections updated** with examples
- [ ] **Test suite passes** against staging environment
- [ ] **Backwards compatibility verified** - no breaking changes
- [ ] **Performance benchmarks met** - response times acceptable
- [ ] **Error handling tested** - proper error responses

### **Post-Deployment Validation**
- [ ] **Health check passes** - API is accessible
- [ ] **Authentication flow works** - login/logout functional
- [ ] **Core workflows tested** - training and assessment systems
- [ ] **Performance monitoring** - response times within limits
- [ ] **Error rates acceptable** - minimal 4xx/5xx responses

## 🤝 Collaboration Workflow

### **Between gritty-app and gritty-api Auggies**

#### **gritty-app Auggie Responsibilities**
1. **Notify of API changes** when modifying controllers, routes, models
2. **Provide change details** - what endpoints were added/modified/removed
3. **Coordinate testing** - ensure staging environment is ready for testing
4. **Set up GitHub Actions** - implement automated sync and testing workflows

#### **gritty-api Auggie Responsibilities**
1. **Update documentation** when notified of API changes
2. **Maintain test suites** - ensure comprehensive coverage
3. **Monitor test results** - identify and report API issues
4. **Provide testing feedback** - report any failures or performance issues

### **Communication Protocol**
1. **API Change Notifications** - gritty-app Auggie notifies gritty-api Auggie
2. **Documentation Updates** - gritty-api Auggie updates specs and tests
3. **Testing Validation** - Both Auggies coordinate testing efforts
4. **Issue Resolution** - Collaborate on fixing any identified problems

## 🎯 Success Metrics

### **Documentation Quality**
- **Accuracy**: API docs match actual implementation
- **Completeness**: All endpoints documented with examples
- **Timeliness**: Updates within 24 hours of API changes

### **Test Coverage**
- **Endpoint Coverage**: 100% of public API endpoints tested
- **Workflow Coverage**: All major user workflows validated
- **Error Coverage**: All error conditions properly tested

### **Performance Standards**
- **Response Times**: < 5000ms for all endpoints
- **Success Rate**: > 99% test pass rate
- **Availability**: 99.9% uptime for staging environment

This integration guide ensures seamless collaboration between the gritty-app and gritty-api repositories, maintaining high-quality API documentation and comprehensive testing coverage.
