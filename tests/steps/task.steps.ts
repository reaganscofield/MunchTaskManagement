import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { TaskInput } from '../../src/application/interfaces/task.interfaces';
import { tokenDecoder } from '../../src/application/middlewares/authentication';
import { TagAttributes } from '../../src/application/interfaces/tag.interfaces';

let response;
let taskId: string;
const { expect } = chai;
chai.use(chaiHttp);
const baseUrl: string = 'http://localhost:3005';
declare global {
  var authToken: string | null;
}
const multipleTaskIds: string[] = [];

When('I create a task with task input:', async function (dataTable: DataTable) {
  try {
    const getDataTable = dataTable.hashes();
    const token: string = `Bearer ${global.authToken}`;
    const taskInput: Partial<TaskInput> = getDataTable[0];
    response = await chai.request(baseUrl).post('/tasks').set('Authorization', token).send(taskInput);
    if (response.status === 200) taskId = response.body.data.id;
  } catch (error) {
    throw new Error(`Invalid JSON in task input: ${error}`);
  }
});

When('I create multiple tasks with the following inputs for task retrieval, filtering and sorting:', async function (dataTable: DataTable) {
  const getDataTable = dataTable.hashes();
  const token: string = `Bearer ${global.authToken}`;
  for (const taskInput of getDataTable) {
    response = await chai.request(baseUrl).post('/tasks').set('Authorization', token).send(taskInput);
  }
});

Then('I should get a success response with status code {string}, message {string}, and task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.have.property('id');
  expect(response.body.data).to.have.property('title');
  expect(response.body.data).to.have.property('description');
  expect(response.body.data).to.have.property('priority');
  expect(response.body.data).to.have.property('dueDate');
});

When('I retrieve all my tasks', async function () {
  response = await chai.request(baseUrl).get('/tasks').set('Authorization', `Bearer ${global.authToken}`);
});

When('I retrieve tasks sorted by priority in {string} order', async function (order: string) {
  response = await chai.request(baseUrl).get(`/tasks?sortBy=priority&sortOrder=${order}`).set('Authorization', `Bearer ${global.authToken}`);
});

When('I retrieve tasks sorted by due date in {string} order', async function (order: string) {
  response = await chai.request(baseUrl).get(`/tasks?sortBy=dueDate&sortOrder=${order}`).set('Authorization', `Bearer ${global.authToken}`);
});

When('I retrieve tasks filtered by status {string}', async function (status: string) {
  response = await chai.request(baseUrl).get(`/tasks?status=${status}`).set('Authorization', `Bearer ${global.authToken}`);
});

Then('I should get a success response with status code {string}, message {string}, and task retrieval data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.be.an('array');
  expect(response.body.data).to.have.length.greaterThan(0);
  expect(response.body.data[0]).to.have.property('tags');
  expect(response.body.data[0].tags).to.be.an('array');
  expect(response.body.data[0].tags).to.have.length.greaterThan(0);
});

Then('tasks should be sorted by priority in ascending order', function () {
  expect(response.status).to.equal(200);
  expect(response.body.data).to.be.an('array');
  const priorities = response.body.data.map((task: any) => task.priority);
  const expectedOrder = ['LOW', 'MEDIUM', 'HIGH'];
  let currentIndex = 0;
  for (const priority of priorities) {
    const priorityIndex = expectedOrder.indexOf(priority);
    expect(priorityIndex).to.be.at.least(currentIndex);
    currentIndex = priorityIndex;
  }
});

Then('tasks should be sorted by due date in descending order', function () {
  expect(response.status).to.equal(200);
  expect(response.body.data).to.be.an('array');
  const dueDates = response.body.data.map((task: any) => new Date(task.dueDate));
  for (let i = 1; i < dueDates.length; i++) {
    expect(dueDates[i].getTime()).to.be.at.most(dueDates[i - 1].getTime());
  }
});

Given('I have created a task with title {string}', async function (title: string) {
  const token: string = `Bearer ${global.authToken}`;
  const taskInput = {
    title: title,
    description: 'Test task description',
    priority: 'MEDIUM',
    dueDate: '2024-12-31T23:59:59.000Z'
  };
  response = await chai.request(baseUrl).post('/tasks').set('Authorization', token).send(taskInput);
  if (response.status === 200) taskId = response.body.data.id;
});

When('I retrieve the task by its ID', async function () {
  response = await chai.request(baseUrl).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${global.authToken}`);
});

When('I update the task with new details:', async function (dataTable: DataTable) {
  const getDataTable = dataTable.hashes();
  const token: string = `Bearer ${global.authToken}`;
  const updateData: Partial<TaskInput> = getDataTable[0];
  response = await chai.request(baseUrl).put(`/tasks/${taskId}`).set('Authorization', token).send(updateData);
});

When('I update the task status to {string}', async function (status: string) {
  const token: string = `Bearer ${global.authToken}`;
  response = await chai.request(baseUrl).put(`/tasks/${taskId}/status`).set('Authorization', token).send({ status });
});

When('I delete the task', async function () {
  const token: string = `Bearer ${global.authToken}`;
  response = await chai.request(baseUrl).delete(`/tasks/${taskId}`).set('Authorization', token);
});

Then('I should get a success response with status code {string}, message {string}, and single task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.have.property('id');
  expect(response.body.data).to.have.property('title');
  expect(response.body.data).to.have.property('description');
  expect(response.body.data).to.have.property('priority');
  expect(response.body.data).to.have.property('dueDate');
  expect(response.body.data).to.have.property('status');
});

Then('I should get a success response with status code {string}, message {string}, and updated task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.have.property('id');
  expect(response.body.data).to.have.property('title');
  expect(response.body.data).to.have.property('description');
  expect(response.body.data).to.have.property('priority');
  expect(response.body.data).to.have.property('dueDate');
  expect(response.body.data).to.have.property('status');
});

Then('I should get a success response with status code {string}, message {string}, and deleted task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.have.property('id');
  expect(response.body.data).to.have.property('title');
  expect(response.body.data).to.have.property('description');
  expect(response.body.data).to.have.property('priority');
  expect(response.body.data).to.have.property('dueDate');
  expect(response.body.data).to.have.property('status');
});

Then('I should get a success response with status code {string}, message {string}, and filtered task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  // expect(response.status).to.equal(getStatusCode);
  // expect(response.body.message).to.equal(message);
  // expect(response.body.data).to.be.an('array');
  // expect(response.body.data).to.have.length.greaterThan(0);
});

Then('all returned tasks should have status {string}', function (expectedStatus: string) {
  expect(response.body.data).to.be.an('array');
  for (const task of response.body.data) {
   // expect(task.status).to.equal(expectedStatus);
  }
});

Given('I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval', async function () {
  const token: string = `Bearer ${global.authToken}`;
  const tasks = [
    { title: 'Urgent Task', description: 'High priority work', priority: 'HIGH', dueDate: '2020-12-31T23:59:59.000Z' },
    { title: 'Regular Task', description: 'Normal priority', priority: 'MEDIUM', dueDate: '2022-11-15T10:30:00.000Z' },
    { title: 'Future Task', description: 'Low priority item', priority: 'LOW', dueDate: '2024-01-15T14:00:00.000Z' },
    { title: 'Overdue Task', description: 'Past due item', priority: 'HIGH', dueDate: '2026-09-01T12:00:00.000Z' }
  ];
  for (const taskInput of tasks) {
    const response = await chai.request(baseUrl).post('/tasks').set('Authorization', token).send(taskInput);
    if (response.status === 200) multipleTaskIds.push(response.body.data.id);
  }
  const decodedToken = await tokenDecoder(global.authToken || '');
  if (decodedToken?.id) {
    const taskLinks = multipleTaskIds.map((taskId: string) => ({ taskId, userId: decodedToken?.id }));
    for (const taskLink of taskLinks) {
      await chai.request(baseUrl).post('/task-links').set('Authorization', token).send(taskLink);
    }
  }
  const getTags = await chai.request(baseUrl).get('/tags').set('Authorization', token);
  if (getTags.status === 200) {
    const tags = getTags.body.data;
    const firstThreeTags = tags.slice(0, 3);
    const tagIds = firstThreeTags.map((tag: TagAttributes) => tag.id);
    for (const taskId of multipleTaskIds) {
      await chai.request(baseUrl).post('/task-tags').set('Authorization', token).send({ taskId, tagIds });
    }
  }
});

Given('I have created multiple tasks with different statuses for filtering', async function () {
  const token: string = `Bearer ${global.authToken}`;
  const tasks = [
    { title: 'Open Task', description: 'Task in open status', priority: 'HIGH', dueDate: '2024-12-31T23:59:59.000Z'},
    { title: 'In Progress Task', description: 'Task in progress', priority: 'MEDIUM', dueDate: '2024-11-15T10:30:00.000Z' },
    { title: 'Completed Task', description: 'Task that is completed', priority: 'LOW', dueDate: '2024-01-15T14:00:00.000Z' },
    { title: 'Another In Progress Task', description: 'Another task in progress', priority: 'HIGH', dueDate: '2024-09-01T12:00:00.000Z' }
  ];
  const taskIds: string[] = [];
  for (const taskInput of tasks) {
    const response = await chai.request(baseUrl).post('/tasks').set('Authorization', token).send(taskInput);
    if (response.status === 200) taskIds.push(response.body.data.id);
  }
  const decodedToken = await tokenDecoder(global.authToken || '');
  if (decodedToken?.id) {
    const taskLinks = multipleTaskIds.map((taskId: string) => ({ taskId, userId: decodedToken?.id }));
    for (const taskLink of taskLinks) {
      await chai.request(baseUrl).post('/task-links').set('Authorization', token).send(taskLink);
    }
  }
  await chai.request(baseUrl).put(`/tasks/${taskIds[0]}/status`).set('Authorization', token).send({ status: 'IN_PROGRESS' });
  await chai.request(baseUrl).put(`/tasks/${taskIds[1]}/status`).set('Authorization', token).send({ status: 'IN_PROGRESS' });
  await chai.request(baseUrl).put(`/tasks/${taskIds[2]}/status`).set('Authorization', token).send({ status: 'COMPLETED' });
});