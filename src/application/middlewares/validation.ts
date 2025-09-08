import httpHelper from '../routes/httpHelper';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

/**
 * @param type - The type of the object to validate
 * @param value - The value to validate
 * @param skipMissingProperties - Whether to skip missing properties
 * @param whitelist - Whether to whitelist properties
 * @param forbidNonWhitelisted - Whether to forbid non-whitelisted properties
 * @returns RequestHandler
*/
export const validation = (type: any,value: 'body' | 'query' | 'params' = 'body', skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true): RequestHandler => {
  return (req, res, next) => {
    const transformed = plainToInstance(type, req[value]);
    validate(transformed, { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        httpHelper.sendBadRequestResponse(res, { error: message });
        return;
      } else {
        next();
      }
    });
  };
};