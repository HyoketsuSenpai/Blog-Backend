import type {Request, Response, NextFunction} from 'express';
import { z, ZodError, type ZodObject } from "zod";

function validateParams(schema: ZodObject<any>){
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            req.validParams = schema.parse(req.params);
            return next();
        } catch(e){
            if (e instanceof ZodError)
            {
                return res.status(422).json({'message': 'Invalid Input','error': z.treeifyError(e)});
            }
            next(e);
        }
    };
}

export default validateParams