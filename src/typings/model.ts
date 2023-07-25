import { ObjectId } from 'mongoose';

type MongoId = {
  _id: ObjectId;
};

export type UserType = {
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
  name: string;
  slug: string;
  views: Number;
  content: string;
  category: string;
  author: UserType;
  lastEditedAt: Date;
  coverImage?: string;
  isPublished: boolean;

  createdAt: Date;
} & MongoId;
