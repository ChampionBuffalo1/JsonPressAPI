import { ObjectId } from 'mongoose';

type MongoId = {
  _id: ObjectId;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
  passwordHash: string;
  socialMedia: Partial<{
    twitter: string;
    website: string;
    facebook: string;
    instagram: string;
  }>;
  role?: 'admin' | 'manager' | 'normal';
  createdAt: Date;
  updatedAt: Date;
} & MongoId;

export type BlogType = {
  title: string;
  slug: string;
  views: Number;
  content: Record<string, unknown>[];
  category: string;
  author: UserType;
  lastEditedAt: Date;
  coverImage?: string;
  isPublished: boolean;
  description?: string;

  createdAt: Date;
} & MongoId;
