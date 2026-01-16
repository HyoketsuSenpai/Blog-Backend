import type {Request, Response, NextFunction} from 'express';
import { z, ZodError, type ZodObject } from "zod";

function validateQuery(schema: ZodObject<any>){
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            req.validQuery = schema.parse(req.query);
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

export default validateQuery