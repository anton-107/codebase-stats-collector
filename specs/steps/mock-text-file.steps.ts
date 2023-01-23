import { Given, Then, When } from "@cucumber/cucumber";
import assert from "assert";

import { MockTextFileTestScenario } from "./mock-text-file-test-scenario.js";

const testScenario = new MockTextFileTestScenario();

Given("there is a mock text file {string}", async function (filePath: string) {
  await testScenario.setCurrentFilePath(filePath);
});

When("I call GetNumberOfLines", async function () {
  await testScenario.getNumberOfLines();
});

Then("I receive number {int} in response", function (expectedValue: number) {
  assert.equal(testScenario.getCurrentResult(), expectedValue);
});
