import chai from 'chai';
import chaiHttp from 'chai-http';
import { Given, When, Then } from '@cucumber/cucumber';
import { UserInput,  UserAuthenticationInput } from '../../src/application/interfaces/user.interfaces';

let response;
const { expect } = chai;
chai.use(chaiHttp);
const baseUrl: string = 'http://localhost:3005/users';

declare global {
  var authToken: string | null;
  var testEmail: string | null;
}

When('I register with a unique email and password {string}', async function (password: string) {
  const timestamp: number = Date.now();
  global.testEmail = `testuser${timestamp}@example.com`;
  const userData: UserInput = { name: 'Test User', email: global.testEmail, password: password };
  response = await chai.request(baseUrl).post('/signup').send(userData);
});

When('I sign in with the same email and password {string}', async function (password: string) {
  const getGlobalTestEmail = global.testEmail as string;
  const userData: UserAuthenticationInput = { email: getGlobalTestEmail, password: password }
  response = await chai.request(baseUrl).post('/signin').send(userData);
  if (response.status === 200) global.authToken = response.body.data.token;
});

Then('I should get a success response with status code {string} and message {string}', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.be.equal(getStatusCode);
  expect(response.body.message).to.be.equal(message);
  expect(response.body.data).to.have.property('id');
  expect(response.body.data).to.have.property('name');
  expect(response.body.data).to.have.property('email');
});

Then('I should get a success response with status code {string} and an authentication token in the response', function (statusCode: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.data).to.have.property('token');
  expect(response.body.data).to.have.property('expiresAt');
});

Given('I am authenticated', async function () {
  const email: string = 'authtest@example.com';
  const password: string = 'Password123!';
  const userSignupData: UserInput = { name: 'Test User', email: email, password: password };
  await chai.request(baseUrl).post('/signup').send(userSignupData);
  const userSigninData: UserAuthenticationInput = { email: email, password: password };
  const signinResponse = await chai.request(baseUrl).post('/signin').send(userSigninData);
  if (signinResponse.status === 200) global.authToken = signinResponse.body.data.token;
});

Given('I have a registered user with email {string} and password {string}', async function (email: string, password: string) {
  const userSignupData: UserInput = { name: 'Test User', email: email, password: password };
  await chai.request(baseUrl).post('/signup').send(userSignupData);
});

When('I sign in with email {string} and password {string}', async function (email: string, password: string) {
  const userData: UserAuthenticationInput = { email: email, password: password };
  response = await chai.request(baseUrl).post('/signin').send(userData);
});

Then('I should get an error response with status code {string} and message {string}', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.be.equal(getStatusCode);
  expect(response.body.error).to.be.equal(message);
});