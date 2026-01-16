import {JwtPayload} from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            validParams?: unknown;
            validQuery?: unknown;
        }
    }
}