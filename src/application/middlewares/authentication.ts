import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { applicationConfig } from '../../config/configLoader';
import httpHelper from '../routes/httpHelper';
import { UserTokenDecoded } from '../interfaces/user.interfaces';
import { User } from '../../database/models/User';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getToken: string | undefined = req.headers['authorization']?.split(' ')[1];
        if (!getToken) {
            return httpHelper.sendUnauthorisedResponse(res, { error: 'Authentication token is required' });
        }
        const decodedToken = await tokenDecoder(getToken);
        if (!decodedToken) {
            return httpHelper.sendUnauthorisedResponse(res, { error: 'Authentication token is invalid' });
        }
        const getUser = await User.findOne({ where: { id: decodedToken.id } });
        if (!getUser) {
            return httpHelper.sendUnauthorisedResponse(res, { error: 'User not found' });
        }
        res.locals.user = decodedToken;
        next();
    } catch (error) {
        return httpHelper.sendInternalServerErrorResponse(res, {
            message: "Failed to authenticate token",
            error: error instanceof Error ? error.message : error
        });
    }
};

export const tokenDecoder = async (token: string): Promise<UserTokenDecoded | null> => {
    try {
        const decoded = jwt.verify(token, applicationConfig.secretKey) as UserTokenDecoded;
        if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.name || !decoded.email) {
            return null;
        }
        return { id: decoded.id, name: decoded.name, email: decoded.email };
    } catch (err) {
        return null;
    }
}