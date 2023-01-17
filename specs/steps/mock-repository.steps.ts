import { Given, When, Then } from "@cucumber/cucumber";

interface MockCommit {
  author: string;
}

class MockRepository {
  private commits: MockCommit[] = [];
  public addCommit(author: string) {
    this.commits.push({author});
  }
}

Given('there is a mock repository', function () {
  // Write code here that turns the phrase above into concrete actions
  this.mockRepo = new MockRepository();
});

Given('there is a mock commit with author {string}', function (commitAuthor: string) {
  // Write code here that turns the phrase above into concrete actions
  this.mockRepo.addCommit(commitAuthor);
});

When('I call GetNumberOfCommitsByAuthor', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('I receive a map with {float} keys in response', function (float) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('key {string} has a value of {string}', function (string, string2) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});