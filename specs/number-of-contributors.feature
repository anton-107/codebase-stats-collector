Feature: Find number of contributors for a file

  Scenario: 3 files changed in 5 commits
    Given there is a mock repository
    Given there is a mock commit with author 'Author One' that changed file 'file1'
    Given there is a mock commit with author 'Author One' that changed file 'file2'
    Given there is a mock commit with author 'Author Two' that changed file 'file2'
    Given there is a mock commit with author 'Author Three' that changed file 'file2'
    Given there is a mock commit with author 'Author Two' that changed file 'file3'
    When I call GetNumberOfContributors for files
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '1'
    And key 'file2' has a value of '3'
    And key 'file3' has a value of '1'
