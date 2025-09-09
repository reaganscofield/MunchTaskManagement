import { TaskController } from '../controllers/TaskController';
import express, { Request, Response, Router } from 'express';
import { TaskDto, UpdateTaskDto, UpdateTaskStatusDto, ValidateUUIDDto } from '../../shared';
import { validation } from '../middlewares/validation';

export const taskEndpoints: Router = express.Router();

taskEndpoints.get('',
  async (req: Request, res: Response) => {
    const taskController: TaskController = new TaskController();
    return taskController.retrieveTasksAssignedToUser(req, res);
  }
);

taskEndpoints.get('/:id', validation(ValidateUUIDDto, 'params'), async (req: Request, res: Response) => {
  const taskController: TaskController = new TaskController();
  return taskController.retrieveTaskById(req, res);
});

taskEndpoints.post('', validation(TaskDto), async (req: Request, res: Response) => {
  const taskController: TaskController = new TaskController();
  return taskController.createTask(req, res);
});

taskEndpoints.put('/:id', validation(ValidateUUIDDto, 'params'), validation(UpdateTaskDto, 'body'), async (req: Request, res: Response) => {
  const taskController: TaskController = new TaskController();
  return taskController.updateTask(req, res);
});

taskEndpoints.put('/:id/status', validation(ValidateUUIDDto, 'params'), validation(UpdateTaskStatusDto, 'body'), async (req: Request, res: Response) => {
  const taskController: TaskController = new TaskController();
  return taskController.updateTaskStatus(req, res);
});

taskEndpoints.delete('/:id', validation(ValidateUUIDDto, 'params'), async (req: Request, res: Response) => {
  const taskController: TaskController = new TaskController();
  return taskController.deleteTask(req, res);
});