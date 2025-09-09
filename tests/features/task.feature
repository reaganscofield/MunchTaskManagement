Feature: Task Management

  As an authenticated user
  I want to manage tasks
  So that I can organize my work

  Background:
    Given I am authenticated

  Scenario: User can create a task with object input
    When I create a task with task input:
      | title           | description        | priority | dueDate                       |
      | My Custom Task  | Custom description | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a success response with status code "200", message "Successfully created task", and task data

  Scenario: User cannot create a task with missing title
    When I create a task with task input:
      | description        | priority | dueDate                       |
      | Custom description | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Title is required, title must be a string"

  Scenario: User cannot create a task with empty title
    When I create a task with task input:
      | title | description        | priority | dueDate                       |
      |       | Custom description | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Title is required"

  Scenario: User cannot create a task with missing description
    When I create a task with task input:
      | title           | priority | dueDate                       |
      | My Custom Task  | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Description is required, description must be a string"

  Scenario: User cannot create a task with empty description
    When I create a task with task input:
      | title           | description | priority | dueDate                       |
      | My Custom Task  |             | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Description is required"

  Scenario: User cannot create a task with missing priority
    When I create a task with task input:
      | title           | description        | dueDate                       |
      | My Custom Task  | Custom description | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Priority is required, Invalid priority, must be LOW, MEDIUM, or HIGH"

  Scenario: User cannot create a task with invalid priority
    When I create a task with task input:
      | title           | description        | priority | dueDate                       |
      | My Custom Task  | Custom description | INVALID  | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Invalid priority, must be LOW, MEDIUM, or HIGH"

  Scenario: User cannot create a task with missing due date
    When I create a task with task input:
      | title           | description        | priority |
      | My Custom Task  | Custom description | HIGH     |
    Then I should get a task error response with status code "400" and message "Due date is required, Due date is required and must be valid"

  Scenario: User cannot create a task with invalid due date
    When I create a task with task input:
      | title           | description        | priority | dueDate    |
      | My Custom Task  | Custom description | HIGH     | invalid-date |
    Then I should get a task error response with status code "400" and message "Due date is required and must be valid"

  Scenario: User can retrieve all their tasks
    Given I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval
    When I retrieve all my tasks
    Then I should get a success response with status code "200", message "Successfully retrieved tasks", and task retrieval data

  Scenario: User can sort tasks by priority in descending order
    Given I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval
    When I retrieve tasks sorted by priority in "asc" order
    Then tasks should be sorted by priority in ascending order

  Scenario: User can sort tasks by due date in descending order
    Given I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval
    When I retrieve tasks sorted by due date in "desc" order
    Then tasks should be sorted by due date in descending order

  Scenario: User can filter tasks by status
    Given I have created multiple tasks with different statuses for filtering
    When I retrieve tasks filtered by status "IN_PROGRESS"
    Then I should get a success response with status code "200", message "Successfully retrieved tasks", and filtered task data
    And all returned tasks should have status "IN_PROGRESS"

  Scenario: User can retrieve a specific task by ID
    Given I have created a task with title "Test Task for Retrieval"
    When I retrieve the task by its ID
    Then I should get a success response with status code "200", message "Successfully retrieved task", and single task data

  Scenario: User can update task details
    Given I have created a task with title "Original Task Title"
    When I update the task with new details:
      | title           | description        | priority | dueDate                       |
      | Updated Task    | Updated description | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a success response with status code "200", message "Successfully updated task details", and updated task data

  Scenario: User cannot update task with empty title
    Given I have created a task with title "Original Task Title"
    When I update the task with new details:
      | title | description        | priority | dueDate                       |
      |       | Updated description | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Title must be a non-empty string or omitted entirely"

  Scenario: User cannot update task with empty description
    Given I have created a task with title "Original Task Title"
    When I update the task with new details:
      | title           | description | priority | dueDate                       |
      | Updated Task    |             | HIGH     | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Description must be a non-empty string or omitted entirely"

  Scenario: User cannot update task with invalid date
    Given I have created a task with title "Original Task Title"
    When I update the task with new details:
      | title           | description         | priority | dueDate      |
      | Updated Task    | Updated description | HIGH     | invalid-date |
    Then I should get a task error response with status code "400" and message "Due date must be a valid date string or omitted entirely"

  Scenario: User cannot update task with invalid priority
    Given I have created a task with title "Original Task Title"
    When I update the task with new details:
      | title           | description         | priority | dueDate                       |
      | Updated Task    | Updated description | INVALID  | 2024-12-31T23:59:59.000Z      |
    Then I should get a task error response with status code "400" and message "Invalid priority, must be LOW, MEDIUM, or HIGH"

  Scenario: User can update task status
    Given I have created a task with title "Task for Status Update"
    When I update the task status to "IN_PROGRESS"
    Then I should get a success response with status code "200", message "Successfully updated task status", and updated task data

  Scenario: User cannot update task status with invalid status
    Given I have created a task with title "Task for Invalid Status Update"
    When I update the task status to "INVALID_STATUS"
    Then I should get a task error response with status code "400" and message "Invalid status, must be OPEN, IN_PROGRESS, or COMPLETED"

  Scenario: User cannot update task status with empty string
    Given I have created a task with title "Task for Empty Status Update"
    When I update the task status to ""
    Then I should get a task error response with status code "400" and message "Invalid status, must be OPEN, IN_PROGRESS, or COMPLETED"

  Scenario: User can delete a task
    Given I have created a task with title "Task to be Deleted"
    When I delete the task
    Then I should get a success response with status code "200", message "Successfully deleted task", and deleted task data

  Scenario: User cannot delete a task with invalid UUID
    Given I have created a task with title "Task to not be Deleted"
    When I try to delete a task with invalid UUID "invalid-uuid-123"
    Then I should get a task error response with status code "400" and message "Invalid UUID"



