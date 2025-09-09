Feature: User Management

  As a user
  I want to register and sign in
  So that I can access the system

  Scenario: User can register and sign in
    When I register with a unique email and password "Password123!"
    Then I should get a success response with status code "200" and message "Successfully created user"
    When I sign in with the same email and password "Password123!"
    Then I should get a success response with status code "200" and an authentication token in the response

  Scenario: User registration fails with weak password
    When I register with a unique email and password "weak"
    Then I should get an error response with status code "400" and message "Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"

  Scenario: User registration fails with password missing requirements
    When I register with a unique email and password "password"
    Then I should get an error response with status code "400" and message "Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol"

  Scenario: User sign in fails with wrong password
    Given I have a registered user with email "test@example.com" and password "Password123!"
    When I sign in with email "test@example.com" and password "WrongPassword123!"
    Then I should get an error response with status code "400" and message "Invalid sign in credentials"

  Scenario: User sign in fails with non-existent email
    When I sign in with email "nonexistent@example.com" and password "Password123!"
    Then I should get an error response with status code "400" and message "Invalid sign in credentials"

  Scenario: User sign in fails with invalid email format
    When I sign in with email "invalid-email" and password "Password123!"
    Then I should get an error response with status code "400" and message "Invalid sign in credentials"
