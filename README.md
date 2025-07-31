# Gritty App Mobile API v1 Documentation

## Overview

Complete REST API documentation for the Gritty App mobile application, providing mental fortitude training for young athletes (11-18). This API enables mobile applications to access user authentication, training content, assessments, achievements, and social features.

## 📁 Documentation Files

This directory contains:

- **`openapi.yaml`** - OpenAPI 3.0 specification for the complete API
- **`gritty-api.postman_collection.json`** - Postman collection with example requests
- **`README.md`** - This documentation file

## 🚀 Quick Start

### 1. Import Postman Collection

1. Open Postman
2. Click "Import" 
3. Select `gritty-api.postman_collection.json`
4. Set environment variables:
   - `base_url`: Your API base URL (e.g., `http://localhost:3000/api/v1`)
   - `token`: Will be set automatically after login
   - `user_id`: Will be set automatically after login

### 2. Authentication Flow

1. **Register** a new user account
2. **Login** to get JWT token (automatically saved to `{{token}}` variable)
3. Use authenticated endpoints with the token

### 3. Test API Health

```bash
curl -X GET "{{base_url}}/health"
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Expiration**: 24 hours
- **Refresh**: Re-login required after expiration
- **Logout**: Client-side token removal (stateless)

## 📊 API Endpoints Overview

### Authentication (8 endpoints)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot_password` - Request password reset
- `POST /auth/reset_password` - Reset password with token
- `PATCH /auth/change_password` - Change password
- `DELETE /auth/account` - Delete account

### User Management (5 endpoints)
- `GET /users/{id}` - Get user by ID
- `GET /users/{id}/profile` - Get user profile
- `PATCH /users/{id}/profile` - Update user profile
- `GET /users/{id}/stats` - Get user statistics
- `GET /users/{id}/history` - Get user activity history

### Training System (6 endpoints)
- `GET /trainings` - List trainings with filters
- `GET /trainings/{id}` - Get training details
- `POST /trainings/{id}/start` - Start training session
- `POST /trainings/{id}/complete` - Complete training
- `GET /user_trainings` - Get user training progress
- `GET /user_trainings/{id}` - Get specific user training

### Assessment System (7 endpoints)
- `GET /assessments` - List available assessments
- `GET /assessments/{id}` - Get assessment details
- `POST /user_assessments` - Start new assessment
- `GET /user_assessments/{id}` - Get assessment progress
- `POST /user_assessments/{id}/progress` - Submit assessment responses
- `PATCH /user_assessments/{id}/complete` - Complete assessment
- `GET /user_assessments/{id}/results` - Get assessment results

### Achievements & Rewards (8 endpoints)
- `GET /achievements` - Get user achievements overview
- `GET /achievements/badges` - Get user badges
- `GET /achievements/points` - Get points history
- `GET /achievements/progress` - Get achievement progress
- `GET /rewards` - List available rewards
- `GET /rewards/{id}` - Get reward details
- `POST /rewards/{id}/claim` - Claim reward
- `GET /rewards/history` - Get redemption history

### Notifications (7 endpoints)
- `GET /notifications` - List user notifications
- `GET /notifications/{id}` - Get notification details
- `PATCH /notifications/{id}` - Mark notification as read
- `DELETE /notifications/{id}` - Delete notification
- `POST /notifications/mark_all_read` - Mark all as read
- `DELETE /notifications/clear_all` - Clear all notifications
- `GET /notifications/settings` - Get notification preferences

### Teams & Social (6 endpoints)
- `GET /teams` - List user teams
- `GET /teams/{id}` - Get team details
- `GET /teams/{id}/members` - Get team members & leaderboard
- `POST /teams/{id}/join` - Join team
- `DELETE /teams/{id}/leave` - Leave team
- `GET /teams/search` - Search public teams

### Health Check (1 endpoint)
- `GET /health` - API health status

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "status": 200,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description or array of messages",
  "status": 400
}
```

## 🏷️ Training Types

The API supports four training types:
- **Foundation** - Core mental skills training
- **Affirmation** - Positive self-talk exercises  
- **Visualization** - Mental imagery training
- **Meditation** - Mindfulness and focus exercises

## 📈 Assessment System

### Categories (4 total)
- **Focus** - Attention and concentration
- **Resilience** - Mental toughness and recovery
- **Confidence** - Self-belief and assurance
- **Mindset** - Growth mindset and attitude

### Scoring
- **Scale**: 1-5 per question (24-120 total range)
- **Rating**: A-E letter grades
- **Stars**: 1-5 star visual rating

## 🎯 Points & Achievements

### Point System
- Training completion: Variable points based on difficulty
- Assessment completion: Bonus points
- Streak bonuses: Daily/weekly consistency rewards
- Social achievements: Team participation rewards

### Badge Categories
- Training milestones (10, 25, 50, 100 completions)
- Assessment achievements (first completion, perfect scores)
- Streak achievements (7, 30, 90 day streaks)
- Social achievements (team participation, leadership)

## 🔧 Development Setup

### Environment Variables Required
```bash
# JWT Configuration
SECRET_KEY_BASE=your_secret_key

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key

# Database
DATABASE_URL=postgresql://localhost/gritty_development
```

### Local Testing
1. Start Rails server: `rails server`
2. API available at: `http://localhost:3000/api/v1`
3. Import Postman collection
4. Set `base_url` to `http://localhost:3000/api/v1`

## 📚 Additional Resources

### OpenAPI Specification
- **File**: `openapi.yaml`
- **Version**: OpenAPI 3.0.3
- **Usage**: Import into Swagger UI, Insomnia, or code generation tools

### Postman Collection
- **File**: `gritty-api.postman_collection.json`
- **Version**: Postman Collection v2.1.0
- **Features**: Pre-request scripts, test assertions, environment variables

## 🐛 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (registration, starting assessments)
- `400` - Bad Request (missing parameters)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource doesn't exist)
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

### Authentication Errors
- Missing Authorization header
- Invalid JWT token format
- Expired JWT token
- User not found

### Validation Errors
- Missing required fields
- Invalid data formats
- Business rule violations

## 📞 Support

For technical support or questions about the API:
- **Team**: Gritty App Development Team
- **Email**: dev@grittyapp.com
- **Documentation**: This repository

## 📄 License

Proprietary - Gritty App, Inc. All rights reserved.
