import z from 'zod';

const title = z.string().min(3).max(255);
const content = z.string().max(10000);

//maybe make a util function for converting to int
const page = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, { message: "page must be a positive number" });
const id = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, { message: "id must be a positive number" });
const userId = z
  .string()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, { message: "user id must be a positive number" });

const makePostSchema = z.object({
    title,
    content,
})
.strict();

const getPostsSchema = z.object({
    page
}).strict();

const getPostByIdSchema = z.object({
    id
}).strict();

const getPostsByUserParamsSchema = z.object({
    userId
}).strict();

const getPostsByUserQuerySchema = z.object({
    page
}).strict();

const deletePostSchema = z.object({
    id
}).strict();

// maybe force the user to give one of the two?
const updatePostBodySchema = z.object({
    title: title.optional(),
    content: content.optional(),
}).strict();

const updatePostParamsSchema = z.object({
    id
}).strict();

export {makePostSchema, getPostsSchema, getPostByIdSchema, getPostsByUserQuerySchema, getPostsByUserParamsSchema, deletePostSchema, updatePostBodySchema, updatePostParamsSchema}