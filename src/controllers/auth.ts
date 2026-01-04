import type {Request, Response} from 'express';
import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

async function signUp(req: Request, res: Response){
    const {name, email, password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        return res.status(422).json({message:"Password and confirmation Password must be equal"});
    }
    
    // Do email and password validation
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

    // create jwt and send both tokens
    // add expiration and refresh tokens later
    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name ?? "Nameless Bum",
        },
        process.env.ACCESS_TOKEN_SECRET!,
    );


    return res.status(201).json({
        message: "User Created Sucessfully",
        accessToken,
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
        process.env.ACCESS_TOKEN_SECRET!
    );

    res.status(200).json({
        message:'Logged in successfully',
        accessToken
    });

}

export {signUp, signIn}