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
