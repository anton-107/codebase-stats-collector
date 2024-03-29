import { Given, Then, When } from "@cucumber/cucumber";
import assert from "assert";

import { AggregateStrategy } from "../../src/stats/aggregate/aggregate.js";
import { ListOfContributorsPerFileAggregate } from "../../src/stats/aggregate/list-of-contributors-per-file-aggregate.js";
import { MockRepositoryTestScenario } from "./mock-repository-test-scenario.js";

const testScenario: MockRepositoryTestScenario =
  new MockRepositoryTestScenario();

Given("there is a mock repository", function () {
  testScenario.createMockRepository();
});

Given("there is a contributor {string}", function (contributorName: string) {
  testScenario.setCurrentContributor(contributorName);
});

Given("they changed file {string}", function (fileName: string) {
  testScenario.commitSingleFileChange(fileName, 0);
});

Given(
  "on {string} they changed file {string}",
  function (changeDate: string, fileName: string) {
    testScenario.commitSingleFileChange(
      fileName,
      Date.parse(changeDate) / 1000
    );
  }
);

Given("I set ignore pattern to {string}", function (ignorePattern: string) {
  testScenario.setFileIgnorePattern(ignorePattern);
});

When("I call GetNumberOfCommitsByAuthor", async function () {
  await testScenario.getNumberOfCommitsByAuthor();
});

Then(
  "I receive a map with {float} keys in response",
  function (expectedLength: number) {
    assert.equal(
      Object.keys(testScenario.getResponseMap()).length,
      expectedLength
    );
  }
);

Then(
  "key {string} has a value of {string}",
  function (key: string, value: string) {
    const map = testScenario.getResponseMap();
    let valueToCompare = map[key];
    if (typeof valueToCompare !== "string") {
      valueToCompare = JSON.stringify(map[key]);
    }
    assert.equal(valueToCompare, value);
  }
);

When("I call GetNumberOfChangesPerFile", async function () {
  await testScenario.getNumberOfChangesPerFile();
});

When("I call GetNumberOfContributors for files", async function () {
  await testScenario.getNumberOfContributorsPerFile();
});

When("I call GetListOfContributorsPerFile method", async function () {
  await testScenario.listNumberOfContributorsPerFile();
});

When(
  "I use a {string} aggregate for {string}",
  function (aggregateKey: AggregateStrategy, aggregateClass: string) {
    switch (aggregateClass) {
      case "ListOfContributorsPerFileAggregate":
        testScenario.runCommitsThroughAggregate(
          new ListOfContributorsPerFileAggregate({ strategy: aggregateKey })
        );
        break;
    }
  }
);
