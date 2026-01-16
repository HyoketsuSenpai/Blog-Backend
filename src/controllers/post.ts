import type {Request, Response} from 'express';
import db from '../config/db/prisma_db.js';

// Refactor to use AuthenticatedRequest type instead of mutating the Request object 
// Add service layer so controller doesnt interact with db directly
// refactor delete and update, using their Many version isnt ideal though convienient
// check behaviour for when page isnt in range
// consider returning pagination metadata (total pages, total posts) in getPosts/getPostsByUser
// maybe normalize responses (always return JSON, even for 204/404) for API consistency
// check behaviour for when userId is bad

async function makePost(req: Request, res: Response){
    const {title, content} = req.body;
    const authorId = req.user!.id;

    try {
        // add profanity check later
        const post = await db.post.create({
            data: {
                title,
                content,
                authorId,
            }
        });

        return res.status(201).json(post);
    } catch(e) {
        return res.sendStatus(500);
    }
}

async function getPosts(req:Request, res: Response) {
    const {page} = req.validQuery as {page: number};
    const postsPerPage = 25;

    try {
        const posts = await db.post.findMany({
            skip: (page - 1) * postsPerPage, 
            take: postsPerPage,
            orderBy: {
                createdAt: 'desc',
            }
        }); 

        return res.json(posts);
    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

async function getPostById(req:Request, res: Response) {
    const {id} = req.validParams as {id: number};

    try {
        const post = await db.post.findUnique({
            where: {id},
            include: {
                // add pagenation to comments 
                comments: true, 
                likes: {
                    where: {userId: req.user!.id},
                    select: {id: true},
                },
                _count: {select: {likes: true}}
            }
        });

        if(!post) {
            return res.sendStatus(404);
        }

        const {likes, ...rest} = post;
        const likedByCurrentUser = likes.length > 0;
        
        return res.json({
            ...rest,
            likedByCurrentUser
        });

    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }

}

async function getPostsByUser(req:Request, res: Response) {
    const {page} = req.validQuery as {page: number};
    const {userId} = req.validParams as {userId: number};
    const postsPerPage = 25;

    try {
        const posts = await db.post.findMany({
            skip: (page - 1) * postsPerPage, 
            take: postsPerPage,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                authorId: userId,
            }
        }); 

        return res.json(posts);
    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

async function deletePost(req:Request, res: Response) {
    // validate
    const {id} = req.validParams as {id: number};

    const authorId = req.user!.id;

    try {
        const result = await db.post.deleteMany({
            where: {
                id,
                authorId,
            }
        });

        if (result.count === 0) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    } catch(e) {
        console.error(e);
        return res.sendStatus(500);
    }
}

async function updatePost(req:Request, res: Response) {
    const {title, content} = req.body;
    const {id} = req.validParams as {id: number};

    const authorId = req.user!.id;

    try {
        const result = await db.post.updateMany({
            where: {
                id,
                authorId,
            },
            data: {
                title,
                content
            }        
        });

        if(result.count === 0){
            return res.sendStatus(404);
        }

        return res.sendStatus(204);

    } catch(e){
        console.error(e);
        return res.sendStatus(500);
    }

}

export {makePost, getPosts, getPostById, getPostsByUser, deletePost, updatePost}
