# Tests

## Test Coverage

- **User Management**: Registration and authentication
- **Task Management**: Create, retrieve, and update task status
- **Tag Management**: Retrieve available tags

## Test Files

- `features/user.feature` - User registration and sign in
- `features/task.feature` - Task management
- `features/tags.feature` - Tag retrieval
- `steps/` - Step definitions for each feature

## Running Tests

1. Ensure your database is running and successfully connected to the application
2. Ensure your application is running on `http://localhost:3005`
3. Run tests: `npm test`

## Notes

To save time and keep the setup minimal, I chose not to create a separate test database
and Docker container. Instead, I opted to run the tests on the existing database and
within the same Docker container. This approach maintains a simple,
efficient testing environment without the overhead of additional configuration.