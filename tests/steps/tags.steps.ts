import { When, Then } from '@cucumber/cucumber';
import chai from 'chai';
import chaiHttp from 'chai-http';

let response;
const { expect } = chai;
chai.use(chaiHttp);
const baseUrl: string = 'http://localhost:3005';
declare global {
  var authToken: string | null;
}

When('I get all tags', async function () {
  response = await chai.request(baseUrl).get('/tags').set('Authorization', `Bearer ${global.authToken}`);
});

Then('I should get a success response with status code {string} and message {string} with the tags data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
});

Then('I should see a list of tags', function () {
  expect(response.body.data).to.be.an('array');
  expect(response.body.data.length).to.be.greaterThan(0);
});