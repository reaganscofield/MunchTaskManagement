import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { TaskInput } from '../../src/application/interfaces/task.interfaces';
import { tokenDecoder } from '../../src/application/middlewares/authentication';
import { TagAttributes } from '../../src/application/interfaces/tag.interfaces';
import { validateTaskWithStatus, makeRequest, linkTasksToUser, tagTasks, validateTaskProperties } from '../shared/helpers';

// Global test state
let response: any;
let taskId: string = '';
const { expect } = chai;
chai.use(chaiHttp);
declare global { var authToken: string | null }


export const validateResponse = (statusCode: number, message: string, dataValidator?: (data: any) => void) => {
  expect(response.status).to.equal(statusCode);
  expect(response.body.message).to.equal(message);
  if (dataValidator) dataValidator(response.body.data);
};

export const createTask = async (taskInput: any): Promise<string | null> => {
  response = await makeRequest('post', '/tasks', taskInput);
  return response.status === 200 ? response.body.data.id : null;
};

When('I create a task with task input:', async function (dataTable: DataTable) {
  try {
    const getDataTable = dataTable.hashes();
    const taskInput = getDataTable[0];
    taskId = await createTask(taskInput) || '';
  } catch (error) {
    throw new Error(`Invalid JSON in task input: ${error}`);
  }
});

Then('I should get a success response with status code {string}, message {string}, and task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  validateResponse(getStatusCode, message, validateTaskProperties);
});

/**
  Retrieve a task by its ID, update the task status, delete the task, and update the task with new details
  The used id is the id of the task created in the given('I have created a task with title {string}') step
*/

When('I retrieve the task by its ID', async function () {
  response = await makeRequest('get', `/tasks/${taskId}`);
});

When('I update the task status to {string}', async function (status: string) {
  response = await makeRequest('put', `/tasks/${taskId}/status`, { status });
});

When('I delete the task', async function () {
  response = await makeRequest('delete', `/tasks/${taskId}`);
});

When('I try to delete a task with invalid UUID {string}', async function (invalidUuid: string) {
  response = await makeRequest('delete', `/tasks/${invalidUuid}`);
});

When('I update the task with new details:', async function (dataTable: DataTable) {
  const getDataTable = dataTable.hashes();
  const updateData = getDataTable[0];
  response = await makeRequest('put', `/tasks/${taskId}`, updateData);
});

Given('I have created a task with title {string}', async function (title: string) {
  const taskInput = { title: title, description: 'Test task description', priority: 'MEDIUM', dueDate: '2024-12-31T23:59:59.000Z'};
  taskId = await createTask(taskInput) || '';
});

Then('I should get a success response with status code {string}, message {string}, and deleted task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  validateResponse(getStatusCode, message, validateTaskWithStatus);
});

Then('I should get a task error response with status code {string} and message {string}', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.be.equal(getStatusCode);
  expect(response.body.error).to.be.equal(message);
});

Then('I should get a success response with status code {string}, message {string}, and single task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  validateResponse(getStatusCode, message, validateTaskWithStatus);
});

Then('I should get a success response with status code {string}, message {string}, and updated task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  validateResponse(getStatusCode, message, validateTaskWithStatus);
});


/**
  Retrieve tasks, sort them by priority and due date
  The tasks are created in the given('I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval') step
*/

export const createMultipleTasks = async (tasks: Partial<TaskInput>[]): Promise<string[]> => {
  const createdTaskIds: string[] = [];
  for (const taskInput of tasks) {
    const taskId = await createTask(taskInput);
    if (taskId) createdTaskIds.push(taskId);
  }
  return createdTaskIds;
};

When('I retrieve all my tasks', async function () {
  response = await makeRequest('get', '/tasks');
});

When('I retrieve tasks sorted by priority in {string} order', async function (order: string) {
  response = await makeRequest('get', `/tasks?sortBy=priority&sortOrder=${order}`);
});

When('I retrieve tasks sorted by due date in {string} order', async function (order: string) {
  response = await makeRequest('get', `/tasks?sortBy=dueDate&sortOrder=${order}`);
});

Given('I have created multiple tasks, linked them to an authenticated user, and tagged them for task retrieval', async function () {
  const tasks = [
    { title: 'Urgent Task', description: 'High priority work', priority: 'HIGH', dueDate: '2020-12-31T23:59:59.000Z' },
    { title: 'Regular Task', description: 'Normal priority', priority: 'MEDIUM', dueDate: '2022-11-15T10:30:00.000Z' },
    { title: 'Future Task', description: 'Low priority item', priority: 'LOW', dueDate: '2024-01-15T14:00:00.000Z' },
    { title: 'Overdue Task', description: 'Past due item', priority: 'HIGH', dueDate: '2026-09-01T12:00:00.000Z' }
  ] as unknown as Partial<TaskInput>[];
  
  const createdTaskIds = await createMultipleTasks(tasks as Partial<TaskInput>[]);
  const decodedToken = await tokenDecoder(global.authToken || '');
  if (decodedToken?.id) {
    await linkTasksToUser(createdTaskIds, decodedToken.id);
  }
  
  const getTags = await makeRequest('get', '/tags');
  if (getTags.status === 200) {
    const tags = getTags.body.data;
    const firstThreeTags = tags.slice(0, 3);
    const tagIds = firstThreeTags.map((tag: TagAttributes) => tag.id);
    await tagTasks(createdTaskIds, tagIds);
  }
});

Then('I should get a success response with status code {string}, message {string}, and task retrieval data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  validateResponse(getStatusCode, message, (data) => {
    expect(data).to.be.an('array');
    expect(data).to.have.length.greaterThan(0);
    expect(data[0]).to.have.property('tags');
    expect(data[0].tags).to.be.an('array');
    expect(data[0].tags).to.have.length.greaterThan(0);
  });
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



/**
  Retrieve tasks, filter them by status
  The tasks are created in the given('I have created multiple tasks with different statuses for filtering') step
*/

When('I retrieve tasks filtered by status {string}', async function (status: string) {
  response = await makeRequest('get', `/tasks?status=${status}`);
});

Given('I have created multiple tasks with different statuses for filtering', async function () {
  const tasks = [
    { title: 'Open Task', description: 'Task in open status', priority: 'HIGH', dueDate: '2024-12-31T23:59:59.000Z'},
    { title: 'In Progress Task', description: 'Task in progress', priority: 'MEDIUM', dueDate: '2024-11-15T10:30:00.000Z' },
    { title: 'Completed Task', description: 'Task that is completed', priority: 'LOW', dueDate: '2024-01-15T14:00:00.000Z' },
    { title: 'Another In Progress Task', description: 'Another task in progress', priority: 'HIGH', dueDate: '2024-09-01T12:00:00.000Z' }
  ] as unknown as Partial<TaskInput>[];
  
  const taskIds = await createMultipleTasks(tasks as Partial<TaskInput>[]);
  
  const decodedToken = await tokenDecoder(global.authToken || '');
  if (decodedToken?.id && taskIds.length > 0) {
    await linkTasksToUser(taskIds, decodedToken.id);
    await makeRequest('put', `/tasks/${taskIds[0]}/status`, { status: 'IN_PROGRESS' });
    await makeRequest('put', `/tasks/${taskIds[1]}/status`, { status: 'IN_PROGRESS' });
    await makeRequest('put', `/tasks/${taskIds[2]}/status`, { status: 'COMPLETED' });
  }
});

Then('I should get a success response with status code {string}, message {string}, and filtered task data', function (statusCode: string, message: string) {
  const getStatusCode: number = parseInt(statusCode);
  expect(response.status).to.equal(getStatusCode);
  expect(response.body.message).to.equal(message);
  expect(response.body.data).to.be.an('array');
  expect(response.body.data).to.have.length.greaterThan(0);
});

Then('all returned tasks should have status {string}', function (expectedStatus: string) {
  expect(response.body.data).to.be.an('array');
  for (const task of response.body.data) {
   expect(task.status).to.equal(expectedStatus);
  }
});