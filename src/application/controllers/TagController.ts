import { Request, Response } from 'express';
import { Tag } from '../../database/models/Tag';
import { ControllerHelpers } from './ControllerHelpers';

export class TagController {

    private helpers: ControllerHelpers = new ControllerHelpers();

    public retrieveTags = async (req: Request, res: Response) => {
        try {
            const tags = await Tag.findAll();
            return this.helpers.sendSuccess(res, "Successfully retrieved tags", tags);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to retrieve tags");
        }
    }
}