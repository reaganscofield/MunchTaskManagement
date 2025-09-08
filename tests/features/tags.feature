Feature: Tag Management

  As a user
  I want to see available tags
  So that I can categorize tasks

  Scenario: User can retrieve tags
    When I get all tags
    Then I should get a success response with status code "200" and message "Successfully retrieved tags" with the tags data
    And I should see a list of tags
