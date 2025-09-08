import { Request, Response } from 'express';
import { TaskTag } from '../../database/models/TaskTag';
import { ControllerHelpers } from './ControllerHelpers';
import { TaskTagInput } from '../interfaces/task-tag.interfaces';

export class TaskTagController {

    private helpers: ControllerHelpers = new ControllerHelpers();

    public tagTask = async (req: Request, res: Response) => {
        try {
            const taskTagInput: TaskTagInput = req.body;
            const task = await this.helpers.findTaskOrFail(taskTagInput.taskId, res);
            if (!task) return;
            const taskTag = await TaskTag.bulkCreate(taskTagInput.tagIds.map(
                (tagId) => ({ taskId: taskTagInput.taskId, tagId }))
            );
            return this.helpers.sendSuccess(res, "Successfully tagged task", taskTag);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to tag task");
        }
    }
}