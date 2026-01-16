import {Router} from 'express';
import validateBody from '../middlewares/validate_body.js';
import {makePost, getPosts, getPostById, getPostsByUser, deletePost, updatePost} from '../controllers/post.js';
import {makePostSchema, getPostsSchema, getPostByIdSchema, getPostsByUserQuerySchema, getPostsByUserParamsSchema, deletePostSchema, updatePostBodySchema, updatePostParamsSchema} from '../schemas/post.schema.js';
import validateParams from '../middlewares/validate_params.js';
import validateQuery from '../middlewares/validate_query.js';

// Maybe merge the validations into one generic validate function
// create any necessary types while you are at it


const router = Router();

router.post('/post', validateBody(makePostSchema), makePost);
router.get('/post', validateQuery(getPostsSchema), getPosts);
router.get('/post/:id', validateParams(getPostByIdSchema), getPostById);
router.get('/user/:userId/posts',validateQuery(getPostsByUserQuerySchema), validateParams(getPostsByUserParamsSchema), getPostsByUser);
router.delete('/post/:id', validateParams(deletePostSchema), deletePost);
router.patch('/post/:id', validateBody(updatePostBodySchema), validateParams(updatePostParamsSchema), updatePost);

export default router;