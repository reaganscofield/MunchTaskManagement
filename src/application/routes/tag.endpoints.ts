import { TagController } from '../controllers/TagController';
import express, { Request, Response, Router } from 'express';

export const tagEndpoints: Router = express.Router();

tagEndpoints.get('', async (req: Request, res: Response) => {
    const tagController: TagController = new TagController();
    return tagController.retrieveTags(req, res);
});