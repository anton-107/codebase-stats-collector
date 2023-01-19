Feature: Find the most active contributors

  Scenario: 3 authors of 5 commits
    Given there is a mock repository
    Given there is a contributor 'Author One'
    And they changed file 'file1'
    And they changed file 'file1'
    And they changed file 'file1'
    Given there is a contributor 'Author Two'
    And they changed file 'file1'
    Given there is a contributor 'Author Three'
    And they changed file 'file1'
    When I call GetNumberOfCommitsByAuthor
    Then I receive a map with 3 keys in response
    And key 'Author One' has a value of '3'
    And key 'Author Two' has a value of '1'
    And key 'Author Three' has a value of '1'
