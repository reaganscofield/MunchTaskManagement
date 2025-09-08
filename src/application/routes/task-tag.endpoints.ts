import { TaskTagController } from '../controllers/TaskTagController';
import express, { Request, Response, Router } from 'express';
import { validation } from '../middlewares/validation';
import { TaskTagDto } from '../../shared';

export const taskTagEndpoints: Router = express.Router();

taskTagEndpoints.post('', validation(TaskTagDto), async (req: Request, res: Response) => {
    const taskTagController: TaskTagController = new TaskTagController();
    return taskTagController.tagTask(req, res);
});