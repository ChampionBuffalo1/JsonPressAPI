import { Error } from 'mongoose';
import { Request, Response } from 'express';
import BlogQueryHelper from '../models/query/blogQueries';
import { JwtPayload, getZodError, sendError } from '../lib';
import { createSchema, updateSchema } from '../validators/blogValidator';

async function getAllBlogs(req: Request, res: Response) {
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined;
  const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip) : undefined;
  const blogs = await BlogQueryHelper.getAllBlogs(limit, skip);
  res.status(200).json({ blogs });
}

async function getPopularBlogs(req: Request, res: Response) {
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined;
  const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip) : undefined;
  const blogs = await BlogQueryHelper.getPopularBlogs(limit, skip);
  res.status(200).json({
    blogs
  });
}

async function getBlogByCategory(req: Request, res: Response) {
  const category = req.params.category;
  if (!category) {
    sendError(res, 'EC01', 401);
  }
  const blogs = await BlogQueryHelper.getBlogByCategory(category);
  res.status(200).json({});
  blogs;
}

async function getAllCategory(_: unknown, res: Response) {
  const uniqueCategories = await BlogQueryHelper.getAllUniqueCategory();
  res.status(200).json({ categories: uniqueCategories });
}

async function getBlogBySlug(req: Request, res: Response) {
  const slug = req.query.query;
  if (!slug || typeof slug !== 'string') {
    return sendError(res, 'ESL01', 401);
  }
  const blog = await BlogQueryHelper.getBlogBySlug(slug);
  res.status(200).json({
    blog
  });
}
async function getUnpublishedBlogs(req: Request, res: Response) {
  const blogs = await BlogQueryHelper.getUnpublishedBlogsOfUser((req.user as JwtPayload).id);
  res.status(200).json({
    blogs
  });
}

async function unpublishBlog(req: Request, res: Response) {
  const slug = req.query.query;
  if (!slug || typeof slug !== 'string') {
    return sendError(res, 'ESL01', 401);
  }
  const blogs = await BlogQueryHelper.getUnpublishedBlogContent((req.user as JwtPayload).id, {
    slug
  });
  res.status(200).json({
    blogs
  });
}

async function createBlog(req: Request, res: Response) {
  const schema = await createSchema.spa(req.body);
  if (!schema.success) {
    res.status(401).json({
      message: getZodError(schema.error)
    });
    return;
  }
  const id = (req.user as JwtPayload).id;
  try {
    const blog = await BlogQueryHelper.createBlog({
      ...schema.data,
      authorId: id
    });
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      return sendError(res, 'ESL02', 401);
    }
    sendError(res, 'E500');
  }
}
async function updateBlog(req: Request, res: Response) {
  const slug = req.params.slug;
  if (!slug) {
    return sendError(res, 'ESL01', 401);
  }
  const schema = await updateSchema.spa(req.body);
  if (!schema.success) {
    return sendError(res, 'EZ01', 400, getZodError(schema.error));
  }
  const id = (req.user as JwtPayload).id;
  try {
    const blog = await BlogQueryHelper.updateBlog(id, schema.data);
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      return sendError(res, 'ESL02', 401);
    }
    sendError(res, 'E500');
  }
}

async function publishBlog(req: Request, res: Response) {
  const slug = req.params.slug;
  if (!slug) {
    return sendError(res, 'ESL01', 401);
  }
  const blog = await BlogQueryHelper.publishBlog(slug);
  if (!blog) {
    res.status(401).json({ message: 'Blog not found' });
    return;
  }
  res.status(200).json({ published: true });
}

async function deleteBlog(req: Request, res: Response) {
  const slug = req.query?.slug as string;
  if (!slug) {
    return sendError(res, 'ESL01', 401);
  }
  const id = (req.user as JwtPayload).id;
  const role = (req.user as JwtPayload).role;
  if (role !== 'normal') {
    const deleted = await BlogQueryHelper.deleteBlog(slug);
    res.status(200).json({ deleted });
  } else {
    const deleted = await BlogQueryHelper.deleteBlog(slug, id);
    res.status(200).json({ deleted });
  }
}

export {
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  getAllBlogs,
  getBlogBySlug,
  unpublishBlog,
  getAllCategory,
  getPopularBlogs,
  getBlogByCategory,
  getUnpublishedBlogs
};
