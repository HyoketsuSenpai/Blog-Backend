import express, { type Express, type Request, type Response } from 'express';
import {connectRedis} from './config/db/redis_db.js'
import {signUp, signIn, token, signOut} from './controllers/auth.js';
import authenticateToken from './middlewares/auth_token.js';
import validateBody from './middlewares/validate_body.js';
import authSchema from './schemas/auth.schema.js';

const { signUpSchema, signInSchema, tokenSchema, logOutSchema } = authSchema;

connectRedis();

const app: Express = express();

app.use(express.json());

app.post('/signup', validateBody(signUpSchema), signUp);
app.post('/login', validateBody(signInSchema), signIn);
app.post('/refresh-token', validateBody(tokenSchema), token);
app.post('/logout', validateBody(logOutSchema), signOut);

app.use(authenticateToken);

app.get('/protected', (req: Request, res: Response)=>{
    return res.json({message:'safe and sound'});
});


app.listen(Number(process.env.PORT) | 3000);