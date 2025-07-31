# Gritty API Documentation Maintenance Guide

## Overview

This repository contains the OpenAPI specification and Postman collection for the Gritty App mobile API. It serves as the single source of truth for API documentation and must be kept in sync with the main `gritty-app` repository while maintaining backwards compatibility.

## Repository Structure

```
gritty-api/
├── README.md                           # Main API documentation
├── openapi.yaml                        # OpenAPI 3.0.3 specification
├── gritty-api.postman_collection.json  # Postman collection with examples
├── MAINTENANCE.md                      # This maintenance guide
└── .gitignore                          # Git ignore rules
```

## Maintenance Responsibilities

### 1. Backwards Compatibility

**Critical Rule**: Never break existing API contracts without proper versioning.

- **Additive Changes**: ✅ Safe to add new endpoints, optional parameters, response fields
- **Modification Changes**: ⚠️ Require careful review - changing required fields, response formats
- **Removal Changes**: ❌ Require new API version - removing endpoints, required fields

### 2. Sync with gritty-app Repository

This repository should be updated when changes are made to:

- **Controllers** in `app/controllers/api/v1/`
- **Routes** in `config/routes.rb` (API routes)
- **Models** that affect API responses
- **Authentication/Authorization** logic
- **Validation rules** that affect API behavior

### 3. Update Process

#### Manual Updates (Current Process)
1. Monitor changes in `gritty-app` repository
2. Update `openapi.yaml` with new/changed endpoints
3. Update `gritty-api.postman_collection.json` with examples
4. Update `README.md` with endpoint counts and descriptions
5. Test Postman collection against development environment
6. Commit and push changes

#### Automated Updates (Future)
- Git deploy action will be configured to automatically sync changes
- This repository serves as backup/direct interface for additional changes

## File-Specific Maintenance

### openapi.yaml
- **Version**: Increment patch version (1.1.0 → 1.1.1) for minor changes
- **Version**: Increment minor version (1.1.0 → 1.2.0) for new endpoints
- **Version**: Increment major version (1.1.0 → 2.0.0) for breaking changes
- **Servers**: Keep development, staging, and production URLs current
- **Security**: Ensure JWT authentication is properly documented
- **Examples**: Include realistic example requests/responses

### gritty-api.postman_collection.json
- **Environment Variables**: Keep `{{base_url}}`, `{{token}}`, `{{user_id}}` updated
- **Pre-request Scripts**: Maintain authentication token handling
- **Test Scripts**: Include basic response validation
- **Examples**: Provide working examples for all endpoints
- **Organization**: Group endpoints logically (Auth, Users, Training, etc.)

### README.md
- **Endpoint Counts**: Update totals when endpoints are added/removed
- **Quick Start**: Ensure setup instructions remain accurate
- **Examples**: Keep curl examples and response formats current
- **Environment Variables**: Document any new required configuration

## Quality Assurance

### Before Committing Changes
- [ ] **Validate OpenAPI**: Use online validator or Swagger Editor
- [ ] **Test Postman Collection**: Import and test key workflows
- [ ] **Check Examples**: Ensure all examples use realistic data
- [ ] **Verify Links**: Confirm all URLs and references are correct
- [ ] **Review Backwards Compatibility**: Ensure no breaking changes

### Testing Checklist
- [ ] **Authentication Flow**: Register → Login → Authenticated requests
- [ ] **Core Workflows**: Training start/complete, Assessment flow
- [ ] **Error Handling**: Test invalid requests return proper error formats
- [ ] **Environment Variables**: Verify Postman variables work correctly

## Version Management

### Semantic Versioning (openapi.yaml)
- **Patch (x.x.X)**: Bug fixes, documentation updates, example improvements
- **Minor (x.X.x)**: New endpoints, optional parameters, additional response fields
- **Major (X.x.x)**: Breaking changes, removed endpoints, changed required fields

### Git Tagging
```bash
# Tag releases for major updates
git tag -a v1.2.0 -m "Add new training endpoints and assessment improvements"
git push origin v1.2.0
```

## Integration with gritty-app

### Monitoring Changes
Watch for changes in these gritty-app files:
- `app/controllers/api/v1/**/*.rb`
- `config/routes.rb`
- `app/models/**/*.rb` (API-relevant models)
- `app/serializers/**/*.rb` (if using serializers)

### Common Update Scenarios

#### New Endpoint Added
1. Add to `openapi.yaml` with full specification
2. Add to Postman collection with example
3. Update README.md endpoint count
4. Test the new endpoint

#### Endpoint Modified
1. Update `openapi.yaml` parameters/responses
2. Update Postman collection examples
3. Verify backwards compatibility
4. Update README.md if needed

#### Authentication Changes
1. Update security schemes in `openapi.yaml`
2. Update Postman pre-request scripts
3. Update README.md authentication section
4. Test full auth flow

## Troubleshooting

### Common Issues
- **Postman Variables Not Working**: Check environment setup and pre-request scripts
- **OpenAPI Validation Errors**: Use Swagger Editor to identify syntax issues
- **Authentication Failures**: Verify JWT token format and expiration handling
- **Missing Examples**: Ensure all endpoints have realistic request/response examples

### Support Contacts
- **Primary**: Augment AI Assistant (this assistant)
- **Backup**: Gritty App Development Team
- **Repository**: https://github.com/GrittyApp/gritty-api

## Future Enhancements

### Planned Improvements
- [ ] Automated sync with gritty-app repository
- [ ] CI/CD pipeline for validation
- [ ] Automated testing of Postman collection
- [ ] Version comparison tools
- [ ] Change notification system

### Tools Integration
- **Swagger UI**: For interactive documentation
- **Postman Monitoring**: For automated collection testing
- **GitHub Actions**: For validation and deployment
- **OpenAPI Generator**: For client SDK generation
