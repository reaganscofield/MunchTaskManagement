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

  Scenario: User can update task status
    Given I have created a task with title "Task for Status Update"
    When I update the task status to "IN_PROGRESS"
    Then I should get a success response with status code "200", message "Successfully updated task status", and updated task data

  Scenario: User can delete a task
    Given I have created a task with title "Task to be Deleted"
    When I delete the task
    Then I should get a success response with status code "200", message "Successfully deleted task", and deleted task data



