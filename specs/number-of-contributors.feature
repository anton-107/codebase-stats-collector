Feature: Find number of contributors for a file

  Scenario: 3 files changed in 5 commits
    Given there is a mock repository
    Given there is a contributor 'Author One'
    And they changed file 'file1'
    And they changed file 'file2'
    Given there is a contributor 'Author Two'
    And they changed file 'file2'
    And they changed file 'file3'
    Given there is a contributor 'Author Three'
    And they changed file 'file2'
    When I call GetNumberOfContributors for files
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '1'
    And key 'file2' has a value of '3'
    And key 'file3' has a value of '1'
