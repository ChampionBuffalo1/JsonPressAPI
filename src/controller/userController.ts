import User from '../models/User';
import { Nullable } from '../typings/reset';
import { UserType } from '../typings/model';

function createUser(name: string, email: string, passwordHash: string): Promise<UserType> {
  const user = new User({
    name,
    email,
    passwordHash
  });
  return user.save();
}

function editUser(id: string, updateDoc: Partial<Omit<UserType, 'id'>>): Promise<Nullable<UserType>> {
  return User.findByIdAndUpdate(
    {
      _id: id
    },
    updateDoc,
    {
      lean: true
    }
  );
}

function deleteUser(id: string): Promise<Nullable<UserType>> {
  return User.findOneAndDelete(
    {
      _id: id
    },
    {
      lean: true
    }
  );
}

function getUserByEmail(email: string, projection?: string): Promise<Nullable<UserType>> {
  return User.findOne(
    {
      email
    },
    projection,
    {
      lean: true
    }
  );
}

function getUser(id: string, projection?: string): Promise<Nullable<UserType>> {
  return User.findById(
    {
      _id: id
    },
    projection,
    {
      lean: true
    }
  );
}

function addSocialMedia(
  _id: string,
  type: 'website' | 'twitter' | 'instagram' | 'facebook',
  value: string
): Promise<Nullable<UserType>> {
  const setObj: Record<string, string> = {};
  setObj[`socialMedia.${type}`] = value;
  return User.findByIdAndUpdate(
    {
      _id
    },
    {
      $set: setObj
    },
    {
      projection: {
        name: true,
        socialMedia: true
      },
      new: true,
      lean: true
    }
  );
}

function addImage(_id: string, image: string): Promise<Nullable<UserType>> {
  return User.findByIdAndUpdate(
    {
      _id
    },
    {
      $set: {
        image
      }
    },
    {
      projection: {
        name: true,
        image: true
      },
      new: true,
      lean: true
    }
  );
}

async function userExists(_id: string): Promise<boolean> {
  return !!(
    await User.exists({
      _id
    })
  )?._id;
}

export { createUser, editUser, deleteUser, getUser, userExists, getUserByEmail, addSocialMedia, addImage };
