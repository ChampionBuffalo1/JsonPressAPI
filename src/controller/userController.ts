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

function getUserByEmail(email: string): Promise<Nullable<UserType>> {
  return User.findOne(
    {
      email
    },
    null,
    {
      lean: true
    }
  );
}
function getUser(id: string): Promise<Nullable<UserType>> {
  return User.findById(
    {
      _id: id
    },
    null,
    {
      lean: true
    }
  );
}

export { createUser, editUser, deleteUser, getUser, getUserByEmail };
