import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import app from './app';
import User from '../interfaces/User';

const auth = getAuth(app);

async function createUser({ name, email, password }: User) {
  const userRecord = await auth.createUser({
    email,
    password,
    displayName: name,
  });
  return userRecord;
}

async function updateUser(uid: string, { name, email }: User) {
  const userRecord = await auth.updateUser(uid, {
    email,
    displayName: name,
  });
  return userRecord;
}

async function updateUserPassword(uid: string, password: string) {
  const userRecord = await auth.updateUser(uid, { password });
  return userRecord;
}

async function deleteUser(uid: string) {
  await auth.deleteUser(uid);
}

async function verifyToken(token: string) {
  let decoded: DecodedIdToken | null = null;
  try {
    decoded = await auth.verifyIdToken(token);
  } catch (error) {
    console.error(error);
  }
  return decoded;
}

export { createUser, updateUser, updateUserPassword, deleteUser, verifyToken };
