import { Error } from 'mongoose';
import { getZodError } from '../lib';
import { UserType } from '../typings/model';
import { Request, Response } from 'express';
import BlogQueryHelper from '../models/query/blogQueries';
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
    res.status(401).json({ message: 'Category is required' });
    return;
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
    res.status(401).json({ message: 'Slug is required' });
    return;
  }
  const blog = await BlogQueryHelper.getBlogBySlug(slug);
  res.status(200).json({
    blog
  });
}
async function getUnpublishedBlogs(req: Request, res: Response) {
  const blogs = await BlogQueryHelper.getUnpublishedBlogsOfUser((req.user as UserType).id);
  res.status(200).json({
    blogs
  });
}

async function unpublishBlog(req: Request, res: Response) {
  const slug = req.query.query;
  if (!slug || typeof slug !== 'string') {
    res.status(401).json({ message: 'Slug is required' });
    return;
  }
  const blogs = await BlogQueryHelper.getUnpublishedBlogContent((req.user as UserType).id, {
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
  const id = (req.user as UserType).id;
  try {
    const blog = await BlogQueryHelper.createBlog({
      ...schema.data,
      authorId: id
    });
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      res.status(401).json({ message: 'Slug already taken' });
      return;
    }
    res.status(401).json({ message: 'Something went wrong' });
  }
}
async function updateBlog(req: Request, res: Response) {
  const slug = req.params.slug;
  if (!slug) {
    res.status(401).json({ message: 'slug is required' });
    return;
  }
  const schema = await updateSchema.spa(req.body);
  if (!schema.success) {
    res.status(401).json({
      message: getZodError(schema.error)
    });
    return;
  }
  const id = (req.user as UserType).id;
  try {
    const blog = await BlogQueryHelper.updateBlog(id, schema.data);
    res.status(200).json({ blog });
  } catch (err) {
    if ((err as Error.ValidationError).message.startsWith('E11000')) {
      res.status(401).json({ message: 'Slug already taken' });
      return;
    }
    res.status(401).json({ message: 'Something went wrong' });
  }
}

async function publishBlog(req: Request, res: Response) {
  const slug = req.params.slug;
  if (!slug) {
    res.status(401).json({ message: 'slug is required' });
    return;
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
    res.status(401).json({ message: 'slug is required' });
    return;
  }
  const id = (req.user as UserType).id;
  const role = (req.user as UserType).role;
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
