import Blog from '../models/Blog';
import { BlogType } from '../typings/model';
import { Nullable } from '../typings/reset';
import { updateSchema } from '../validators/blogValidator';

const projection = '-passwordHash -email -__v';

function createBlog(
  title: string,
  slug: string,
  authorId: string,
  category: string,
  content: Record<string, unknown>[],
  coverImage?: string,
  description?: string
): Promise<BlogType> {
  const blog = new Blog({
    slug,
    title,
    content,
    category,
    coverImage,
    description,
    author: authorId,
    isPublished: false,
    lastEditedAt: new Date()
  });
  return blog.save();
}

function updateBlog(_id: string, data: updateSchema): Promise<Nullable<BlogType>> {
  return Blog.findOneAndUpdate(
    {
      _id
    },
    {
      $set: {
        ...data,
        isPublished: false,
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

function deleteBlog(slug: string, id?: string): Promise<Nullable<BlogType>> {
  const query: Record<string, string> = { slug };
  // if id isn't provided, and this fn is called that it means that the user was admin/manager
  if (id) query['author'] = id;
  return Blog.findOneAndDelete(query, {
    new: true
  })
    .populate('author', projection)
    .exec();
}
function publishBlog(slug: string): Promise<Nullable<BlogType>> {
  return Blog.findOneAndUpdate(
    {
      slug
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

function getAllBlogs(limit?: number, skip?: number): Promise<BlogType[]> {
  const query = Blog.find(
    {
      isPublished: true
    },
    '-content -__v',
    { lean: true }
  ).populate('author', projection);
  if (skip && skip > 0) query.skip(skip);
  if (limit) query.limit(limit);
  return query.exec();
}

function getUnpublishedBlogsOfUser(id: string): Promise<BlogType[]> {
  return Blog.find(
    {
      author: id,
      isPublished: false
    },
    '-content -__v',
    {
      lean: true
    }
  )
    .populate('author', projection)
    .exec();
}

function getBlogByCategory(category: string, limit?: number, skip?: number): Promise<BlogType[]> {
  const query = Blog.find(
    {
      category,
      isPublished: true
    },
    null
  ).populate('author', projection);
  if (skip && skip > 0) query.skip(skip);
  if (limit) query.limit(limit);
  return query.exec();
}

function getPopularBlogs(limit?: number, skip?: number): Promise<BlogType[]> {
  const query = Blog.find(
    {
      isPublished: true
    },
    null,
    {
      sort: {
        views: -1
      }
    }
  ).populate('author', projection);
  if (skip && skip > 0) query.skip(skip);
  if (limit) query.limit(limit);
  return query.exec();
}

async function getBlogBySlug(slug: string): Promise<Nullable<BlogType>> {
  const blog = Blog.findOne(
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
  await Blog.findOneAndUpdate(
    {
      slug
    },
    {
      $inc: {
        views: 1
      }
    }
  );
  return blog;
}

function getAllUniqueCategory(): Promise<string[]> {
  return Blog.find({
    isPublished: true
  })
    .distinct('category')
    .exec();
}

function deleteAllBlogs(category?: string): Promise<Awaited<ReturnType<typeof Blog.deleteMany>>> {
  return Blog.deleteMany(category ? { category } : {}).exec();
}

function getUnpublishedBlogContent(author?: string, otherCond?: Record<string, unknown>) {
  const query = Blog.findOne({
    ...otherCond,
    isPublished: false
  }).populate('author', projection);
  if (author) query.where('author').equals(author);
  return query.exec();
}

export {
  createBlog,
  deleteBlog,
  updateBlog,
  publishBlog,
  getAllBlogs,
  getBlogBySlug,
  deleteAllBlogs,
  getPopularBlogs,
  getBlogByCategory,
  getAllUniqueCategory,
  getUnpublishedBlogContent,
  getUnpublishedBlogsOfUser
};
