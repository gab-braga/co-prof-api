import { getFirestore, Query } from 'firebase-admin/firestore';
import app from './app';
import Filter from '../interfaces/Filter';
import Sort from '../interfaces/Sort';

const db = getFirestore(app);

async function save(local: string, data: any): Promise<any> {
  const docRef = await db.collection(local).add(data);
  const doc = await docRef.get();
  return { ...doc.data(), id: doc.id };
}

async function update(local: string, id: string, data: any): Promise<any> {
  const docRef = db.collection(local).doc(id);
  await docRef.update(data);
  const doc = await docRef.get();
  return { ...doc.data(), id: doc.id };
}

async function remove(local: string, id: string): Promise<any> {
  const docRef = db.collection(local).doc(id);
  await docRef.delete();
}

async function findById(local: string, id: string): Promise<any> {
  const docRef = db.collection(local).doc(id);
  const doc = await docRef.get();
  return { ...doc.data(), id: doc.id };
}

async function findAll(local: string): Promise<any> {
  const collectionRef = db.collection(local);
  const snapshot = await collectionRef.get();

  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
}

async function findByUserId(local: string, userId: string): Promise<any> {
  const collectionRef = db.collection(local);
  const snapshot = await collectionRef.where('userId', '==', userId).get();

  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
}

async function findWithFilters(local: string, filters: Filter[], sort: Sort | null = null): Promise<any> {
  const collectionRef = db.collection(local);
  let query: Query = collectionRef;
  
  for (const { field, value } of filters) {
    query = query.where(field, "==", value);
  }

  if (sort) {
    const { field, direction } = sort;
    query = query.orderBy(field, direction);
  }

  const snapshot = await query.get();

  const data: any[] = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
}

export { save, update, remove, findAll, findById, findByUserId, findWithFilters };
