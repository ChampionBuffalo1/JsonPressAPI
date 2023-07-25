import { Schema, model } from 'mongoose';
import { UserType } from '../typings/model';

const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'username is required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required']
    },
    passwordHash: {
      type: String,
      required: [true, 'hashed password must be provided']
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'normal'],
      default: 'normal'
    },
    socialMedia: {
      default: {},
      type: {
        twitter: String,
        instagram: String,
        website: String
      },
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default model('User', UserSchema);
