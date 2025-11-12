import express, {type Express, Request, Response} from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.end('hello world');
});

app.listen(3000);