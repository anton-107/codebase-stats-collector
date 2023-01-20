import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { TestScenario } from "./test-scenario.js";

let testScenario: TestScenario  = new TestScenario();

Given('there is a mock repository', function () {
  testScenario.createMockRepository();
});

Given('there is a contributor {string}', function (contributorName: string) {
  testScenario.setCurrentContributor(contributorName);
});

Given('they changed file {string}', function (fileName: string) {
  testScenario.commitSingleFileChange(fileName);
});

When('I call GetNumberOfCommitsByAuthor', async function () {
  await testScenario.getNumberOfCommitsByAuthor();
});

Then('I receive a map with {float} keys in response', function (expectedLength: number) {
  assert.equal(Object.keys(testScenario.getResponseMap()).length, expectedLength);
});

Then('key {string} has a value of {string}', function (key: string, value: string) {
  const map = testScenario.getResponseMap();
  assert.equal(map[key], value);
});

When('I call GetMostChangedFiles', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('I call GetNumberOfContributors for files', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});