import chai from 'chai';
import chaiHttp from 'chai-http';

let response: any;
const { expect } = chai;
chai.use(chaiHttp);
const baseUrl: string = 'http://localhost:3005';

declare global {
  var authToken: string | null;
}

export const getAuthHeaders = () => ({ 'Authorization': `Bearer ${global.authToken}` });

export const makeRequest = async (method: 'get' | 'post' | 'put' | 'delete', endpoint: string, data?: any) => {
  const request = chai.request(baseUrl)[method](endpoint).set(getAuthHeaders());
  return data ? request.send(data) : request;
};

export const validateTaskProperties = (task: any) => {
  expect(task).to.have.property('id');
  expect(task).to.have.property('title');
  expect(task).to.have.property('description');
  expect(task).to.have.property('priority');
  expect(task).to.have.property('dueDate');
};

export const validateTaskWithStatus = (task: any) => {
  validateTaskProperties(task);
  expect(task).to.have.property('status');
};

export const validateResponse = (statusCode: number, message: string, dataValidator?: (data: any) => void) => {
  expect(response.status).to.equal(statusCode);
  expect(response.body.message).to.equal(message);
  if (dataValidator) dataValidator(response.body.data);
};

export const linkTasksToUser = async (taskIds: string[], userId: string) => {
  for (const taskId of taskIds) {
    await makeRequest('post', '/task-links', { taskId, userId });
  }
};

export const tagTasks = async (taskIds: string[], tagIds: string[]) => {
  for (const taskId of taskIds) {
    await makeRequest('post', '/task-tags', { taskId, tagIds });
  }
};