Feature: Find the most changed files

  Scenario: 3 authors of 5 commits
    Given there is a mock repository
    Given there is a mock commit with author 'Author One'
    Given there is a mock commit with author 'Author Two'
    Given there is a mock commit with author 'Author One'
    Given there is a mock commit with author 'Author Three'
    Given there is a mock commit with author 'Author One'
    When I call GetNumberOfCommitsByAuthor
    Then I receive a map with 3 keys in response
    And key 'Author One' has a value of '3'
    And key 'Author Two' has a value of '1'
    And key 'Author Three' has a value of '3'
