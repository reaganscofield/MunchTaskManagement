import { Request, Response } from 'express';
import { Task } from '../../database/models/Task';
import { TaskInput, TaskQueryParams, TaskStatus } from '../interfaces/task.interfaces';
import { TaskStatuses } from '../../shared';
import { TaskLink } from '../../database/models/TaskLink';
import { WhereOptions, Order, Transaction } from 'sequelize';
import { ControllerHelpers } from './ControllerHelpers';
import  sequelizeInstance  from "../../database/models"; 
import { TaskTag } from '../../database/models/TaskTag';
import { Tag } from '../../database/models/Tag';

export class TaskController {

    private helpers: ControllerHelpers = new ControllerHelpers();

    public retrieveTaskById = async (req: Request, res: Response) => {
        try {
            const taskId: string = req.params.id;
            const task = await this.helpers.findTaskOrFail(taskId, res);
            if (!task) return;
            return this.helpers.sendSuccess(res, "Successfully retrieved task", task);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to retrieve task");
        }
    }

    public retrieveTasksAssignedToUser = async (req: Request, res: Response) => {
        try {
            const userId: string = res.locals.user.id;
            const queryParams: TaskQueryParams = {
                status: req.query.status as keyof typeof TaskStatuses,
                sortBy: req.query.sortBy as 'dueDate' | 'priority',
                sortOrder: req.query.sortOrder as 'asc' | 'desc'
            };

            const whereClause: WhereOptions = {};
            if (queryParams.status && Object.values(TaskStatuses).includes(queryParams.status as TaskStatus)) {
                whereClause.status = queryParams.status;
            }

            let orderClause: Order = [];
            if (queryParams.sortBy && queryParams.sortOrder) {
                if (queryParams.sortBy === 'dueDate') {
                    orderClause = [['dueDate', queryParams.sortOrder.toUpperCase()]];
                } else if (queryParams.sortBy === 'priority') {
                    orderClause = [['priority', queryParams.sortOrder.toUpperCase()]];
                }
            } else {
                orderClause = [['createdAt', 'DESC']];
            }

            const tasks = await Task.findAll({ 
                raw: false,
                where: whereClause,
                order: orderClause,
                include: [
                    {
                        model: TaskLink,
                        where: { userId: userId },
                        attributes: ['id', 'userId']
                    },
                    {
                        model: TaskTag,
                        attributes: ['id', 'taskId', 'tagId'],
                        include: [
                            {
                                model: Tag,
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ]
            });
            
            const mappedTasks = tasks.map((task: any) => {
                const taskData = task.toJSON();
                const tags = taskData.TaskTags ? taskData.TaskTags.map((taskTag: any) => taskTag.Tag) : [];
                delete taskData.TaskLinks;
                delete taskData.TaskTags;
                taskData.tags = tags;
                return taskData;
            });
            return this.helpers.sendSuccess(res, "Successfully retrieved tasks", mappedTasks);
        } catch (error) {
           return this.helpers.sendError(res, error, "Failed to retrieve tasks");
        }
    }  

    public createTask = async (req: Request, res: Response) => {
        try {
            const taskInput: TaskInput = req.body;
            const userId: string = res.locals.user.id;
            taskInput.createdByUserId = userId;
            taskInput.status = TaskStatuses.OPEN 
            const task = await Task.create(taskInput);
            return this.helpers.sendSuccess(res, "Successfully created task", task);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to create task");
        }
    }

    public updateTask = async (req: Request, res: Response) => {
        try {
            const taskInput: Partial<TaskInput> = req.body;
            const taskId: string = req.params.id;
            const task = await this.helpers.findTaskOrFail(taskId, res);
            if (!task) return;
            const [, [updatedTask]] = await Task.update(taskInput, { where: { id: taskId }, returning: true });
            return this.helpers.sendSuccess(res, "Successfully updated task details", updatedTask);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to update task");
        }
    }

    public updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const status: TaskStatus = req.body.status;
            const taskId: string = req.params.id;
            const task = await this.helpers.findTaskOrFail(taskId, res);
            if (!task) return;
            const  [, [updatedTask]] = await Task.update(
                { status }, { where: { id: taskId }, returning: true }
            );
            return this.helpers.sendSuccess(res, "Successfully updated task status", updatedTask);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to update task status");
        }
    }

    public deleteTask = async (req: Request, res: Response) => {
        try {
            const taskId: string = req.params.id;
            const task = await this.helpers.findTaskOrFail(taskId, res);
            if (!task) return;
            await sequelizeInstance.sequelize.transaction(async (transaction: Transaction) => {
                await TaskLink.destroy({ where: { taskId: taskId }, transaction });
                await TaskTag.destroy({ where: { taskId: taskId }, transaction });
                await Task.destroy({ where: { id: taskId }, transaction });
            });
            return this.helpers.sendSuccess(res, "Successfully deleted task", task);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to delete task");
        }
    }
}