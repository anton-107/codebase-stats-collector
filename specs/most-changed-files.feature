Feature: Find the most changed files

  Scenario: 3 files changed in 5 commits
    Given there is a mock repository
    Given there is a contributor 'Author One'
    And they changed file 'file1'
    And they changed file 'file2'
    And they changed file 'file1'
    And they changed file 'file3'
    And they changed file 'file1'
    When I call GetNumberOfChangesPerFile
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '3'
    And key 'file2' has a value of '1'
    And key 'file3' has a value of '1'

  Scenario: there are files changes in dist/ folder and I want to ignore those
    Given there is a mock repository
    Given there is a contributor 'Author One'
    And they changed file 'file1'
    And they changed file 'file2'
    And they changed file 'file1'
    And they changed file 'file3'
    And they changed file 'file1'
    And they changed file 'dist/file1'
    And they changed file 'dist/file2'
    And they changed file 'dist/file3'
    And I set ignore pattern to '^dist/'
    When I call GetNumberOfChangesPerFile
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '3'
    And key 'file2' has a value of '1'
    And key 'file3' has a value of '1'
