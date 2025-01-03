Feature: Aggregate class is an abstract class to keep summary of a repository stats while repository history is being processed

  Aggregate class supports summarizing stats either by year-month (e.g. 2023-04) or by year-quarter (e.g. 2023-Q2) pairs

  Scenario: Attempts to use an unsupported aggregate strategy
    Given I use a TestAggregate class
    When I use a 'year-week' strategy
    Then I receive an error reading 'Unknown aggregate strategy'

  Scenario: commits of type equal should not result in a increment
    Given I use a TestAggregate class
    When I use a 'year-month' strategy
    And I add commit of type 'equal'
    Then incrementValue method of the aggregate should not have been called
    When I call listFiles method
    Then I get an empty list in response

  Scenario: commits of type modify should aggregate data for a file-key (year-quarter)
    Given I use a TestAggregate class
    When I use a 'year-quarter' strategy
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-04'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-03'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-02'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-01'
    When I call listAggregates method for 'src/file-1'
    Then I get a list with 1 value in response
    When I call getValue method for 'src/file-1' and '2023-Q2'
    Then I get a number with value 4 in response

  Scenario: commits of type modify should aggregate data for a file-key (year)
    Given I use a TestAggregate class
    When I use a 'year' strategy
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-04'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-03'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-02'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-01'
    When I call listAggregates method for 'src/file-1'
    Then I get a list with 1 value in response
    When I call getValue method for 'src/file-1' and '2023'
    Then I get a number with value 4 in response

  Scenario: commits of type modify should aggregate data for a file-key (all-time)
    Given I use a TestAggregate class
    When I use a 'all-time' strategy
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2022-05-04'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2023-05-03'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2024-05-02'
    And I add commit of type 'modify' with filename 'src/file-1' and commite date '2025-05-01'
    When I call listAggregates method for 'src/file-1'
    Then I get a list with 1 value in response
    When I call getValue method for 'src/file-1' and 'all-time'
    Then I get a number with value 4 in response