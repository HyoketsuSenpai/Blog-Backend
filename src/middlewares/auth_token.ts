import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

function authenticateToken(req: Request, res: Response, next: NextFunction){
    const token: string | undefined = req.get('authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.user = user;
    next();    
}

export default authenticateToken