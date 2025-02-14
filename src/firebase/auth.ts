import { getAuth } from 'firebase-admin/auth';
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

export { createUser };
