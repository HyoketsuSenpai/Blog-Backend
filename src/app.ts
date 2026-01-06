import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import {connectRedis} from './config/db/redis_db.js'
import authenticateToken from './middlewares/auth_token.js';
import authRouter from './routes/auth.js';

connectRedis();

const app: Express = express();

app.use(express.json());

app.use(authRouter);

app.use(authenticateToken);

app.get('/protected', (req: Request, res: Response)=>{
    return res.json({message:'safe and sound'});
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(Number(process.env.PORT) || 3000);