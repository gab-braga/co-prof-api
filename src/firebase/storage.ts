import { getStorage } from 'firebase-admin/storage';
import app from './app';

const storage = getStorage(app);

async function uploadFile(file: Express.Multer.File, path: string) {
  const bucket = storage.bucket();
  const fileName = `${path}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: { contentType: file.mimetype },
  });

  const urlFile = await new Promise<string>((resolve, reject) => {
    stream.on('error', (error) => {
      console.error(error);
      reject('Falha no envio do arquivo. Tente novamente mais tarde.');
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const urlFile = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(urlFile);
    });

    stream.end(file.buffer);
  });

  return urlFile;
}

export { uploadFile };
