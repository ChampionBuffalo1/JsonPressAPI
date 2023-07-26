import User from './User';
import { Schema, model } from 'mongoose';
import { BlogType } from '../typings/model';

const BlogSchema = new Schema<BlogType>({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  content: {
    type: Schema.Types.Mixed,
    required: [true, 'content is required']
  },
  coverImage: {
    type: String,
    required: [true, 'coverImage is required']
  },
  slug: {
    type: String,
    required: [true, 'blog slug is required']
  },
  author: {
    type: User,
    required: [true, 'blog author is required']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  category: String,
  lastEditedAt: {
    type: Date,
    required: true
  }
});

export default model('Blogs', BlogSchema);
