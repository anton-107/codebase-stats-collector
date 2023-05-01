Feature: Aggregate class is an abstract class to keep summary of a repository stats while repository history is being processed

  Aggregate class supports summarizing stats either by year-month (e.g. 2023-04) or by year-quarter (e.g. 2023-Q2) pairs

  Scenario: Attempts to use an unsupported aggregate strategy
    Given I use a TestAggregate class
    When I use a 'year-week' strategy
    Then I receive an error reading 'Unknown aggregate strategy'