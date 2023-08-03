import passport from 'passport';
import { Router } from 'express';
import { isLoggedIn, isManager } from '../../middleware/authorized';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  getAllBlogs,
  getBlogBySlug,
  getPopularBlogs,
  getBlogByCategory,
  getAllCategory,
  getUnpublishedBlogs,
  unpublishBlog
} from '../../controller/blogController';

const blogRouter = Router();

blogRouter.get('/getAll', getAllBlogs);
blogRouter.get('/getPopular', getPopularBlogs);
blogRouter.get('/category/:category', getBlogByCategory);
blogRouter.get('/getAllCategory', getAllCategory);

blogRouter.get('/slug', getBlogBySlug);

blogRouter.use(
  passport.authenticate('jwt', {
    session: false
  })
);

blogRouter.get('/getUnpublished', isLoggedIn, getUnpublishedBlogs);

blogRouter.get('/unpublished/slug', isLoggedIn, unpublishBlog);

blogRouter.post('/create', isLoggedIn, createBlog);

blogRouter.post('/update/:slug', isLoggedIn, updateBlog);

blogRouter.post('/publish/:slug', isManager, publishBlog);

blogRouter.delete('/delete', isLoggedIn, deleteBlog);

export default blogRouter;
