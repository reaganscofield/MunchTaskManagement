import httpHelper from '../routes/httpHelper';
import { Request, Response } from 'express';
import { User } from '../../database/models/User';
import bcrypt from 'bcrypt';
import { UserInput, UserAuthenticationInput } from '../interfaces/user.interfaces';
import jwt from 'jsonwebtoken';
import { applicationConfig } from '../../config/configLoader';
import { ControllerHelpers } from './ControllerHelpers';

export class UserController {

    private helpers: ControllerHelpers = new ControllerHelpers();

    public createUser = async (req: Request, res: Response) => {
        try {
            const userInput: UserInput = req.body;
            const existingUser = await User.findOne({ where: { email: userInput.email } });
            if (existingUser) {
                const data = { error: "User with this email already exists" };
                return httpHelper.sendBadRequestResponse(res, data);
            }
            const hashedPassword = await bcrypt.hash(userInput.password, 10);
            userInput.password = hashedPassword;
            const user = await User.create(userInput);
            const data = { id: user.id, name: user.name, email: user.email }
            return this.helpers.sendSuccess(res, "Successfully created user", data);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to create user");
        }
    }

    public authenticateUser = async (req: Request, res: Response) => {
        try {
            const userInput: UserAuthenticationInput = req.body;
            const existingUser = await User.findOne({ where: { email: userInput.email } });
            if (!existingUser) {
                const data = { error: "Invalid sign in credentials" };
                return httpHelper.sendBadRequestResponse(res, data);
            }
            const isPasswordValid = await bcrypt.compare(userInput.password, existingUser.password);
            if (!isPasswordValid) {
                const data = { error: "Invalid sign in credentials" };
                return httpHelper.sendBadRequestResponse(res, data);
            }
            const createdToken = jwt.sign(
                { id: existingUser.id, name: existingUser.name, email: existingUser.email }, 
                applicationConfig.secretKey, 
                { expiresIn: '10d' }
            );
            const data = { token: createdToken, expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }
            return this.helpers.sendSuccess(res, "Successfully logged in user", data);
        } catch (error) {
            return this.helpers.sendError(res, error, "Failed to login user");
        }
    }
}