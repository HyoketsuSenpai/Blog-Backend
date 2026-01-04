import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';

function authenticateToken(req: Request, res: Response, next: NextFunction){
    const token: string | undefined = req.get('authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = user;
    next();    
}