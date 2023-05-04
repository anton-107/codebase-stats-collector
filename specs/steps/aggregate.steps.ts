import { Given, Then, When } from "@cucumber/cucumber";
import assert from "assert";

import { ChangedFileType } from "../../src/interfaces.js";
import {
  AggregateTestScenario,
  TestAggregate,
} from "./aggregate-test-scenario.js";

const testScenario = new AggregateTestScenario();

Given("I use a TestAggregate class", function () {
  testScenario.setAggregateInstanceClass(TestAggregate);
});
When("I use a {string} strategy", function (strategy: string) {
  testScenario.setStrategy(strategy);
});
Then("I receive an error reading {string}", function (errorMessage: string) {
  assert.equal(testScenario.getLastKnownError(), `Error: ${errorMessage}`);
});
When("I add commit of type {string}", function (commitType: ChangedFileType) {
  testScenario.addCommitWithType(commitType);
});
Then(
  "incrementValue method of the aggregate should not have been called",
  function () {
    testScenario.checkIncrementCallsCount(0);
  }
);
When("I call listFiles method", function () {
  testScenario.listFiles();
});
Then("I get an empty list in response", function () {
  testScenario.checkLastResponseDeepEqual([]);
});
When(
  "I add commit of type {string} with filename {string} and commite date {string}",
  function (commitType: ChangedFileType, filename: string, commitDate: string) {
    testScenario.addSingleFileCommit(commitType, filename, commitDate);
  }
);
When("I call listAggregates method for {string}", function (fileName: string) {
  testScenario.listAggregates(fileName);
});
Then("I get a list with {int} value in response", function (int: number) {
  testScenario.checkLastResponseListLength(int);
});
When(
  "I call getValue method for {string} and {string}",
  function (fileName: string, aggregateKey: string) {
    testScenario.getValue(fileName, aggregateKey);
  }
);
Then("I get a number with value {int} in response", function (int) {
  testScenario.checkLastResponseDeepEqual(int);
});
