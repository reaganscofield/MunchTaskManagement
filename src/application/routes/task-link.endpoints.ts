import { TaskLinkController } from '../controllers/TaskLinkController';
import express, { Request, Response, Router } from 'express';
import { TaskLinkDto } from '../../shared';
import { validation } from '../middlewares/validation';

export const taskLinkEndpoints: Router = express.Router();

taskLinkEndpoints.post('', validation(TaskLinkDto), async (req: Request, res: Response) => {
    const taskLinkController: TaskLinkController = new TaskLinkController();
    return taskLinkController.assignTaskToUser(req, res);
});