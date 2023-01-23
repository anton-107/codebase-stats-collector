Feature: Find files with the most lines of code

  Scenario: 1 mock file
    Given there is a mock text file '../mocks/text-file.txt'
    When I call GetNumberOfLines
    Then I receive number 21 in response