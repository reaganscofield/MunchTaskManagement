# MunchTaskManagement

A comprehensive task management backend API built with Node.js, Express, TypeScript, and PostgreSQL. This application provides user authentication, task management, tagging system, and task assignment capabilities.

## 🚀 Features

- **User Management**: User registration and authentication with JWT tokens
- **Task Management**: Create, read, update, delete, and status management for tasks
- **Task Assignment**: Assign tasks to users with task linking
- **Tagging System**: Tag tasks with predefined categories
- **Priority Management**: Set task priorities (LOW, MEDIUM, HIGH)
- **Status Tracking**: Track task status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- **Comprehensive Logging**: Winston-based logging with daily rotation
- **Input Validation**: Class-validator for request validation
- **Database Seeding**: Pre-populated tags and initial data

## 🛠️ Tech Stack

- **Runtime**: Node.js (>=22.0.0)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class-validator & Class-transformer
- **Logging**: Winston with daily rotate file
- **Testing**: Cucumber (BDD) with Chai
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (>=22.0.0)
- Docker & Docker Compose
- npm or yarn package manager

## 🐳 Database Setup with Docker

### 1. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=munch_task_management

# Application Configuration
APPLICATION_PORT=3005
LOG_DIR=./src/logs

# JWT Secret (use a strong, random string)
SECRET_KEY=your_super_secret_jwt_key_here
```

### 2. Start PostgreSQL Database

```bash
# Start the PostgreSQL database container
docker-compose up -d

# Verify the database is running
docker ps
```

The database will be available at:
- **Host**: localhost
- **Port**: 5432
- **Database**: munch_task_management
- **User**: your_db_user
- **Password**: your_secure_password

### 3. Database Management

```bash
# Stop the database
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v

# View database logs
docker-compose logs db

# Access PostgreSQL shell
docker exec -it postgres_db psql -U your_db_user -d munch_task_management
```

## 🚀 Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

```bash
# Start the application in development mode with hot reload
npm run dev
```

The application will start on `http://localhost:3005` (or your configured port).

### 3. Health Check

Once the application is running, you can verify it's working correctly by checking the health endpoint:

```bash
# Check application health
curl http://localhost:3005/health
```

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-09T10:30:00.000Z",
  "service": "Munch Task Management API",
  "databaseStatus": "Database is successfully connected"
}
```

The health check endpoint provides:
- **Application status**: Confirms the API is running
- **Database connectivity**: Verifies PostgreSQL connection
- **Timestamp**: Current server time

### 4. Application Logs

Logs are stored in the `src/logs/` directory:
- **Debug logs**: `src/logs/debug/YYYY-MM-DD.log`
- **Error logs**: `src/logs/error/YYYY-MM-DD.log`

## 🧪 Running Tests

### Prerequisites for Testing

1. Ensure the database is running (`docker-compose up -d`)
2. Ensure the application is running (`npm run dev`)
3. The application should be accessible at `http://localhost:3005`

### Run Tests

```bash
# Run all BDD tests
npm test
```

### Test Coverage

The test suite covers:

- **User Management**: Registration and authentication
- **Task Management**: Create, retrieve, update, and delete tasks
- **Task Status Management**: Update task status
- **Tag Management**: Retrieve available tags
- **Task Assignment**: Assign tasks to users
- **Task Tagging**: Tag tasks with categories

### Test Structure

```
tests/
├── features/
│   ├── user.feature      # User registration and sign in
│   ├── task.feature      # Task management operations
│   └── tags.feature      # Tag retrieval
├── steps/
│   ├── user.steps.ts     # User-related step definitions
│   ├── task.steps.ts     # Task-related step definitions
│   └── tags.steps.ts     # Tag-related step definitions
└── shared/
    └── helpers.ts        # Shared test utilities and helpers
```

## 📚 API Documentation

### Base URL
```
http://localhost:3005
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### User Management
- `POST /users/signup` - Register a new user
- `POST /users/signin` - Authenticate user and get JWT token

#### Task Management
- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks for authenticated user
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update task details
- `PUT /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete a task

#### Task Assignment
- `POST /task-links` - Assign a task to a user

#### Tag Management
- `GET /tags` - Get all available tags

#### Task Tagging
- `POST /task-tags` - Tag a task with categories

### Request/Response Examples

#### User Registration
```json
POST /users/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Task Creation
```json
POST /tasks
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "HIGH",
  "dueDate": "2025-12-31T23:59:59.000Z"
}
```

#### Task Status Update
```json
PUT /tasks/:id/status
{
  "status": "COMPLETED"
}
```

## 📦 Postman Collection

A comprehensive Postman collection is available with full documentation and interactive testing capabilities:

### 🌐 Online Collection Documentation
**Full Postman Collection Documentation**: [https://www.postman.com/reaganscofield/munchtaskmanagement/documentation/x02xeed/munchtaskmanagement-collection](https://www.postman.com/reaganscofield/munchtaskmanagement/documentation/x02xeed/munchtaskmanagement-collection)

This online documentation provides:
- **Complete endpoint documentation** with examples
- **Request/response samples** for all operations
- **Environment setup guides**
- **Authentication workflows**

### 📁 Local Collection File
A local Postman collection is also included in the repository (`PostmanCollection.json`) with:

- **Pre-configured requests** for all API endpoints
- **Environment variables** for easy testing
- **Sample responses** for reference
- **Authentication setup** with JWT tokens

### Importing the Local Collection

1. Open Postman
2. Click "Import" button
3. Select the `Collection.postman.json` file
4. Set up environment variables:
   - `domain`: `http://localhost:3005`
   - `token`: Your JWT token (obtained from signin)

### Collection Structure

The collection includes requests for:
- User signup and signin
- Task CRUD operations
- Task status updates
- Task assignment
- Tag retrieval
- Task tagging

## 🏗️ Project Structure

```
src/
├── application/
│   ├── controllers/          # Request handlers
│   ├── interfaces/           # TypeScript interfaces
│   ├── middlewares/          # Express middlewares
│   └── routes/              # API route definitions
├── config/
│   ├── configLoader.ts      # Environment configuration
│   └── logger.ts            # Winston logger setup
├── database/
│   ├── models/              # Sequelize models
│   ├── connection.ts        # Database connection
│   ├── initializeDatabaseConnection.ts
│   └── seedData.ts          # Initial data seeding
├── logs/                    # Application logs
├── shared/
│   ├── DTOs.ts              # Data Transfer Objects
│   └── taskEnums.ts         # Task-related enums
└── server.ts                # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `POSTGRES_USER` | PostgreSQL username | - | ✅ |
| `POSTGRES_PASSWORD` | PostgreSQL password | - | ✅ |
| `POSTGRES_DB` | PostgreSQL database name | - | ✅ |
| `APPLICATION_PORT` | Application port | 3005 | ❌ |
| `LOG_DIR` | Log directory path | ./src/logs | ❌ |
| `SECRET_KEY` | JWT secret key | - | ✅ |

### Database Models

- **User**: User authentication and profile
- **Task**: Task management with priority and status
- **Tag**: Predefined task categories
- **TaskLink**: Task assignment to users
- **TaskTag**: Many-to-many relationship between tasks and tags

## 🚨 Important Notes

### Database Management

- The application uses `force: true` in development, which recreates tables on startup

### Testing Strategy

- Tests run against the same database as the application
- No separate test database is configured for simplicity
- Ensure the application is running before executing tests

---

**Happy Task Managing! 🎯**
