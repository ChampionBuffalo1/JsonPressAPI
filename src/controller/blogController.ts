import Blog from '../models/Blog';
import { BlogType } from '../typings/model';
import { Nullable } from '../typings/reset';

const projection = '-passwordHash -email -__v';

function createBlog(
  title: string,
  slug: string,
  authorId: string,
  category: string,
  content: Record<string, unknown>[]
): Promise<BlogType> {
  const blog = new Blog({
    slug,
    title,
    content,
    category,
    author: authorId,
    isPublished: false,
    lastEditedAt: new Date()
  });
  return blog.save();
}

function updateBlog(
  _id: string,
  key: 'content' | 'title' | 'slug' | 'coverImage',
  value: any
): Promise<Nullable<BlogType>> {
  return Blog.findOneAndUpdate(
    {
      _id
    },
    {
      $set: {
        [key]: value,
        lastEditedAt: new Date()
      }
    },
    {
      new: true
    }
  )
    .populate('author', projection)
    .exec();
}

function deleteBlog(id: string): Promise<Nullable<BlogType>> {
  return Blog.findOneAndDelete(
    {
      _id: id
    },
    {
      new: true
    }
  )
    .populate('author', projection)
    .exec();
}
function publishBlog(id: string): Promise<Nullable<BlogType>> {
  return Blog.findOneAndUpdate(
    {
      _id: id
    },
    {
      $set: {
        isPublished: true
      }
    },
    {
      new: true
    }
  )
    .populate('author', projection)
    .exec();
}

function getAllBlogs(): Promise<BlogType[]> {
  return Blog.find({}, null, { lean: true }).populate('author', projection).exec();
}

async function getBlogById(id: string): Promise<Nullable<BlogType>> {
  const blog = await Blog.findById(id, null, { lean: true }).populate('author', projection).exec();
  await Blog.findOneAndUpdate(
    {
      _id: id
    },
    {
      $inc: {
        views: 1
      }
    }
  );
  return blog;
}

function getBlogByCategory(category: string, limit?: number): Promise<BlogType[]> {
  return Blog.find(
    {
      category
    },
    null,
    {
      limit
    }
  )
    .populate('author', projection)
    .exec();
}

function getPopularBlogs(limit?: number): Promise<BlogType[]> {
  return Blog.find({}, null, {
    sort: {
      views: -1
    },
    limit: limit || -1
  })
    .populate('author', projection)
    .exec();
}

function getBlogBySlug(slug: string): Promise<Nullable<BlogType>> {
  return Blog.findOne(
    {
      slug
    },
    null,
    {
      lean: true
    }
  )
    .populate('author', projection)
    .exec();
}

function getAllUniqueCategory(): Promise<string[]> {
  return Blog.find().distinct('category').exec();
}

export {
  createBlog,
  deleteBlog,
  updateBlog,
  publishBlog,
  getBlogById,
  getAllBlogs,
  getBlogBySlug,
  getPopularBlogs,
  getBlogByCategory,
  getAllUniqueCategory
};
