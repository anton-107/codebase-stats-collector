Feature: Find the most changed files

  Scenario: 3 files changed in 5 commits
    Given there is a mock repository
    Given there is a mock commit that changed file 'file1'
    Given there is a mock commit that changed file 'file2'
    Given there is a mock commit that changed file 'file1'
    Given there is a mock commit that changed file 'file3'
    Given there is a mock commit that changed file 'file1'
    When I call GetMostChangedFiles
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '3'
    And key 'file2' has a value of '1'
    And key 'file3' has a value of '1'
