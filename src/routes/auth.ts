import {Router} from 'express';
import { signUp, signIn, token, signOut } from '../controllers/auth.js';
import validateBody from '../middlewares/validate_body.js';
import { signUpSchema, signInSchema, tokenSchema, logOutSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/signup', validateBody(signUpSchema), signUp);
router.post('/login', validateBody(signInSchema), signIn);
router.post('/refresh-token', validateBody(tokenSchema), token);
router.post('/logout', validateBody(logOutSchema), signOut);

export default router