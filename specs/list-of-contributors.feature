Feature: Collect detailed list of contributors for a file

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
    When I call GetListOfContributorsPerFile method
    Then I receive a map with 3 keys in response
    And key 'file2' has a value of '[{"name":"Author One","numberOfChanges":1,"firstChangeTimestamp":0,"lastChangeTimestamp":0},{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":0,"lastChangeTimestamp":0},{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":0,"lastChangeTimestamp":0}]'
