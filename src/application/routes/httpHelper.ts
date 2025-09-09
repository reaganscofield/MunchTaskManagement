import { Response } from 'express';
import { UnknownType } from '../interfaces/shared.interfaces';

function sendOkResponse(res: Response, data: UnknownType): Response {
    return res.status(200).send(data);
}

function sendCreatedResponse(res: Response, data: UnknownType): Response {
    return res.status(201).send(data);
}

function sendBadRequestResponse(res: Response, data: UnknownType): Response {
    return res.status(400).send(data);
}
 
function sendUnauthorisedResponse(res: Response, data: UnknownType): Response  {
    return res.status(401).send(data);
}

function sendForbiddenResponse(res: Response, data: UnknownType): Response {
    return res.status(403).send(data);
}
 
function sendNotFoundResponse(res: Response, data: UnknownType): Response  {
    return res.status(404).send(data);
}

function sendInternalServerErrorResponse(res: Response, data: UnknownType): Response  {
    return res.status(500).send(data);
}

export default {
    sendOkResponse,
    sendCreatedResponse,
    sendBadRequestResponse,
    sendUnauthorisedResponse,
    sendForbiddenResponse,
    sendNotFoundResponse,
    sendInternalServerErrorResponse
};