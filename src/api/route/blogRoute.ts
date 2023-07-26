import { Router } from 'express';
import passport from 'passport';
import { getZodError } from '../../lib';
import { UserType } from '../../typings/model';
import { createSchema } from '../../validators/blogValidator';
import { isLoggedIn, isManager } from '../../middleware/authorized';
import {
  createBlog,
  publishBlog,
  getAllBlogs,
  getBlogBySlug,
  getPopularBlogs,
  getBlogByCategory,
  getAllUniqueCategory
} from '../../controller/blogController';

const blogRouter = Router();

blogRouter.get('/getAll', async (_, res) => {
  const blogs = await getAllBlogs();
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
  const id = (req.user as UserType)?._id.toString();
  const schema = await createSchema.spa(req.body);
  if (!schema.success) {
    res.status(401).json({
      message: getZodError(schema.error.issues)
    });
    return;
  }
  const { category, content, slug, title } = schema.data;
  const blog = await createBlog(title, slug, id, category, content);
  res.status(200).json({ blog });
});

blogRouter.post('/publish/:blogId', isManager, async (req, res) => {
  const blogId = req.params.blogId;
  if (!blogId) {
    res.status(401).json({ message: 'Blog Id is required' });
    return;
  }
  const blog = await publishBlog(blogId);
  if (!blog) {
    res.status(401).json({ message: 'Blog not found' });
    return;
  }
  res.status(200).json({ blog });
});

export default blogRouter;
