import type {Request, Response} from 'express';
import db from '../config/db/prisma_db.js';
import bcrypt from "bcrypt";
import jwt, {type JwtPayload}from 'jsonwebtoken';

import setRefreshToken from '../utils/set_refresh_token.js';
import getRefreshToken from '../utils/get_refresh_token.js';
import deleteRefreshToken from '../utils/delete_refresh_token.js';

async function signUp(req: Request, res: Response){
    const {name, email, password, confirmPassword} = req.body;

    // sanitize that shi before anything bruh

    const exist = await db.user.findUnique({
        where: {email},
    });

    if(exist){
        return res.status(400).json({message:"Email already used"});
    }

    // hash the password before saving it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name ?? "Nameless Bum",
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: '30s'}
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name ?? "Nameless Bum",
        },
        process.env.REFRESH_TOKEN_SECRET!,
    )

    // add refresh token to db
    await setRefreshToken(refreshToken);

    return res.status(201).json({
        message: "User Created Sucessfully",
        accessToken,
        refreshToken
    });

}

async function signIn(req: Request, res: Response){
    const {email, password} = req.body;

    const user = await db.user.findUnique({
        where: {
            email
        }
    });

    if(!user){
        return res.status(401).json({message:'Wrong Credentials'});
    }

    const match: boolean = await bcrypt.compare(password, user.password);

    if(!match){
        return res.status(401).json({message:'Wrong Credentials'});
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email,
            name: user.name ?? "Nameless Bum",        
        },
        process.env.ACCESS_TOKEN_SECRET!, 
        {expiresIn: '30s'}
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name ?? "Nameless Bum",
        },
        process.env.REFRESH_TOKEN_SECRET!,
    )

    // add refresh token to db
    await setRefreshToken(refreshToken);

    res.status(200).json({
        message:'Logged in successfully',
        accessToken,
        refreshToken
    });

}

async function token(req: Request, res: Response){
    const refreshToken = req.body.token;

    // if (refreshToken == null) return res.sendStatus(401);
    //check for refresh token in db
    const exists = await getRefreshToken(refreshToken);

    if(!exists){
        return res.sendStatus(401);
    }

    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (typeof user === 'string') {
        return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name ?? "Nameless Bum",
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:'30s'}
    );

    return res.json({accessToken});
}

async function signOut(req: Request, res: Response){
    const refreshToken = req.body.token;
    // delete token from db
    await deleteRefreshToken(refreshToken);
    res.sendStatus(203);
}

export {signUp, signIn, token, signOut}