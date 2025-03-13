import { getFirestore } from 'firebase-admin/firestore';
import app from './app';

const db = getFirestore(app);

async function save(local: string, data: any) {
  const docRef = await db.collection(local).add(data);
  const doc = await docRef.get();
  return doc;
}

async function findAll(local: string) {
  const collectionRef = db.collection(local);
  const snapshot = await collectionRef.get();
  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
}

async function findById(local: string, id: string) {
  const docRef = db.collection(local).doc(id);
  const doc = await docRef.get();
  return doc;
}

export { save, findAll, findById };
