import { UserController } from '../controllers/UserController';
import express, { Request, Response, Router } from 'express';
import { UserSignupDto, UserSigninDto } from '../../shared';
import { validation } from '../middlewares/validation';

export const userEndpoints: Router = express.Router();

userEndpoints.post('/signup', validation(UserSignupDto), async (req: Request, res: Response) => {
    const userController: UserController = new UserController();
    return userController.createUser(req, res);
});

userEndpoints.post('/signin', validation(UserSigninDto), async (req: Request, res: Response) => {
    const userController: UserController = new UserController();
    return userController.authenticateUser(req, res);
});