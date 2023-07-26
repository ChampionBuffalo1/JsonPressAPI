import { Schema, model } from 'mongoose';
import { BlogType } from '../typings/model';

const BlogSchema = new Schema<BlogType>({
  title: {
    type: String,
    required: [true, 'title is required']
  },
  content: {
    type: Schema.Types.Mixed,
    required: [true, 'content is required']
  },
  coverImage: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'blog slug is required']
  },
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: [true, 'author is required']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  lastEditedAt: {
    type: Date,
    required: true
  }
});

export default model('Blogs', BlogSchema);
