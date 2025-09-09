import { Request, Response } from 'express';
import { TaskLink } from '../../database/models/TaskLink';
import { TaskLinkInput } from '../interfaces/task-link.interfaces';
import { ControllerHelpers } from './ControllerHelpers';

export class TaskLinkController {

    private helpers: ControllerHelpers = new ControllerHelpers();

    public assignTaskToUser = async (req: Request, res: Response) => {
        try {
            const taskLinkInput: TaskLinkInput = req.body;
            const task = await this.helpers.findTaskOrFail(taskLinkInput.taskId, res);
            const user = await this.helpers.findUserOrFail(taskLinkInput.userId, res);
            const userAlreadyAssignedToTask = await this.userAlreadyAssignedToTask(taskLinkInput.userId, taskLinkInput.taskId);
            if (userAlreadyAssignedToTask) {
                return this.helpers.sendError(res, "User already assigned to task", "User already assigned to task");
            }
            if (!task || !user) return;
            const taskLink = await TaskLink.create(taskLinkInput);
            const data = Object.assign(taskLink.get({ plain: true }), { task });
            return this.helpers.sendSuccess(res, "Successfully assigned task to user", data);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to assign task to user");
        }
    }

    private async userAlreadyAssignedToTask(userId: string, taskId: string) {
        const taskLink = await TaskLink.findOne({ where: { userId, taskId } });
        return taskLink ? true : false;
    }
}