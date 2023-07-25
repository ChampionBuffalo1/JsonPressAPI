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
    instagram: string;
  }>;
  role?: 'admin' | 'manager'; // If role isn't present then its a normal user
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
