import passport from 'passport';
import { Router } from 'express';
import type { Error } from 'mongoose';
import { getZodError } from '../../lib';
import { UserType } from '../../typings/model';
import { createSchema, updateSchema } from '../../validators/blogValidator';
import { isLoggedIn, isManager } from '../../middleware/authorized';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  getAllBlogs,
  getBlogBySlug,
  deleteAllBlogs,
  getPopularBlogs,
  getBlogByCategory,
  getAllUniqueCategory,
} from '../../controller/blogController';

const blogRouter = Router();

blogRouter.get('/getAll', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
  const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
  const blogs = await getAllBlogs(limit, skip);
  res.status(200).json({ blogs });
});

blogRouter.get('/getPopular', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : -1;
  const blogs = await getPopularBlogs(limit);
  res.status(200).json({
    blogs
  });
});

blogRouter.get('/category/:category', async (req, res) => {
  const category = req.params.category;
  if (!category) {
    res.status(401).json({ message: 'Category is required' });
    return;
  }
  const blogs = await getBlogByCategory(category);
  res.status(200).json({});
  blogs;
});

blogRouter.get('/getAllCategory', async (_, res) => {
  const uniqueCategories = await getAllUniqueCategory();
  res.status(200).json({ categories: uniqueCategories });
});

blogRouter.get('/slug', async (req, res) => {
  const slug = req.query.query as string;
  if (!slug) {
    res.status(401).json({ message: 'Slug is required' });
    return;
  }
  const blog = await getBlogBySlug(slug);
  res.status(200).json({
    blog
  });
});

blogRouter.use(
  passport.authenticate('jwt', {
    session: false
  })
);

blogRouter.post('/create', isLoggedIn, async (req, res) => {
  const schema = await createSchema.spa(req.body);
  if (!schema.success) {
    res.status(401).json({
      message: getZodError(schema.error.issues)
    });
    return;
  }
  const id = (req.user as UserType).id;
  const { category, content, slug, title } = schema.data;
  try {
    const blog = await createBlog(title, slug, id, category, content, schema.data.coverImage);
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      res.status(401).json({ message: 'Slug already taken' });
      return;
    }
    res.status(401).json({ message: 'Something went wrong' });
  }
});

blogRouter.post('/update/:slug', isLoggedIn, async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(401).json({ message: 'slug is required' });
    return;
  }
  const schema = await updateSchema.spa(req.body);
  if (!schema.success) {
    res.status(401).json({
      message: getZodError(schema.error.issues)
    });
    return;
  }
  const id = (req.user as UserType).id;
  try {
    const blog = await updateBlog(id, schema.data);
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      res.status(401).json({ message: 'Slug already taken' });
      return;
    }
    res.status(401).json({ message: 'Something went wrong' });
  }
});

blogRouter.post('/publish/:slug', isManager, async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(401).json({ message: 'slug is required' });
    return;
  }
  const blog = await publishBlog(slug);
  if (!blog) {
    res.status(401).json({ message: 'Blog not found' });
    return;
  }
  res.status(200).json({ published: true });
});

blogRouter.delete('/delete', isLoggedIn, async (req, res) => {
  const slug = req.query?.slug as string;
  if (!slug) {
    res.status(401).json({ message: 'slug is required' });
    return;
  }
  const id = (req.user as UserType).id;
  const role = (req.user as UserType).role;
  if (role !== 'normal') {
    const deleted = await deleteBlog(slug);
    res.status(200).json({ deleted });
  } else {
    const deleted = await deleteBlog(slug, id);
    res.status(200).json({ deleted });
  }
});

blogRouter.delete('/all', isManager, async (req, res) => {
  const category = req.query?.category as string;
  const deleted = await deleteAllBlogs(category);
  res.status(200).json({ deleted });
});
export default blogRouter;
