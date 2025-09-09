import httpHelper from "../routes/httpHelper";
import { Response } from "express";
import { UnknownType } from "../interfaces/shared.interfaces";
import { Task } from "../../database/models/Task";
import { WhereOptions } from "sequelize";
import { User } from "../../database/models/User";

export class ControllerHelpers {

  public sendSuccess(res: Response, message: string, data?: UnknownType | unknown) {
    return httpHelper.sendOkResponse(res, { message, data });
  }
    
  public sendError(res: Response, error: unknown, message: string) {
    return httpHelper.sendInternalServerErrorResponse(res, {
      message,
      error: error instanceof Error ? error.message : error,
    });
  }
    
  public async findTaskOrFail(taskId: string, res: Response) {
    const whereClause: WhereOptions = { where: { id: taskId }, raw: true };
    const task = await Task.findOne(whereClause);
    if (!task) {
      httpHelper.sendBadRequestResponse(res, { error: "Task not found" });
      return null;
    }
    return task;
  }

  public async findUserOrFail(userId: string, res: Response) {
    const whereClause: WhereOptions = { where: { id: userId }, raw: true };
    const user = await User.findOne(whereClause);
    if (!user) {
      httpHelper.sendBadRequestResponse(res, { error: "User not found" });
      return null;
    }
    return user;
  }
}