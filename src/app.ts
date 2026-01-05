import express, { type Express, type Request, type Response } from 'express';
import {connectRedis} from './config/db/redis_db.js'
import {signUp, signIn} from './controllers/auth.js';
import authenticateToken from './middlewares/auth_token.js';

connectRedis();

const app: Express = express();

app.use(express.json());

app.post('/signup', signUp);
app.post('/login', signIn);

app.use(authenticateToken);

app.get('/protected', (req: Request, res: Response)=>{
    return res.json({message:'safe and sound'});
});


app.listen(Number(process.env.PORT) | 3000);