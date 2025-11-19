import express, { type Express } from 'express';

const app: Express = express();

app.use(express.json());

app.listen(Number(process.env.PORT) | 3000);