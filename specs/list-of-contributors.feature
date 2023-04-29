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

  Scenario: 3 files changed in 5 commits in various time
    Given there is a mock repository
    Given there is a contributor 'Author One'
    And on '2022-01-01' they changed file 'file1'
    And on '2021-01-01' they changed file 'file1'
    And on '2021-01-01' they changed file 'file2'
    Given there is a contributor 'Author Two'
    And on '2020-01-01' they changed file 'file2'
    And on '2022-01-01' they changed file 'file3'
    Given there is a contributor 'Author Three'
    And on '2020-03-15' they changed file 'file2'
    And on '2022-01-03' they changed file 'file3'
    And on '2022-01-03' they changed file 'file3'
    And on '2022-01-04' they changed file 'file3'
    And on '2022-01-01' they changed file 'file3'
    When I call GetListOfContributorsPerFile method
    Then I receive a map with 3 keys in response
    And key 'file1' has a value of '[{"name":"Author One","numberOfChanges":2,"firstChangeTimestamp":1609459200,"lastChangeTimestamp":1640995200}]'
    And key 'file2' has a value of '[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1577836800,"lastChangeTimestamp":1577836800},{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":1584230400,"lastChangeTimestamp":1584230400},{"name":"Author One","numberOfChanges":1,"firstChangeTimestamp":1609459200,"lastChangeTimestamp":1609459200}]'
    And key 'file3' has a value of '[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1640995200},{"name":"Author Three","numberOfChanges":4,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1641254400}]'


    Scenario: 3 files changed in 5 commits in various time ran through aggregate
      Given there is a mock repository
      Given there is a contributor 'Author One'
      And on '2022-01-03' they changed file 'file1'
      And on '2022-01-01' they changed file 'file1'
      And on '2022-01-02' they changed file 'file1'
      Given there is a contributor 'Author Two'
      And on '2020-01-01' they changed file 'file2'
      And on '2022-01-01' they changed file 'file3'
      And on '2022-04-01' they changed file 'file3'
      Given there is a contributor 'Author Three'
      And on '2020-03-15' they changed file 'file2'
      And on '2022-04-03' they changed file 'file3'
      When I use a 'year-month' aggregate for 'ListOfContributorsPerFileAggregate'
      Then I receive a map with 3 keys in response
      And key 'file1' has a value of '{"2022-01":[{"name":"Author One","numberOfChanges":3,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1641168000}]}'
      And key 'file2' has a value of '{"2020-01":[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1577836800,"lastChangeTimestamp":1577836800}],"2020-03":[{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":1584230400,"lastChangeTimestamp":1584230400}]}'
      And key 'file3' has a value of '{"2022-01":[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1640995200}],"2022-04":[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1648771200,"lastChangeTimestamp":1648771200},{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":1648944000,"lastChangeTimestamp":1648944000}]}'
      When I use a 'year-quarter' aggregate for 'ListOfContributorsPerFileAggregate'
      Then I receive a map with 3 keys in response
      And key 'file1' has a value of '{"2022-Q1":[{"name":"Author One","numberOfChanges":3,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1641168000}]}'
      And key 'file2' has a value of '{"2020-Q1":[{"name":"Author Two","numberOfChanges":1,"firstChangeTimestamp":1577836800,"lastChangeTimestamp":1577836800},{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":1584230400,"lastChangeTimestamp":1584230400}]}'
      And key 'file3' has a value of '{"2022-Q1":[{"name":"Author Two","numberOfChanges":2,"firstChangeTimestamp":1640995200,"lastChangeTimestamp":1648771200},{"name":"Author Three","numberOfChanges":1,"firstChangeTimestamp":1648944000,"lastChangeTimestamp":1648944000}]}'