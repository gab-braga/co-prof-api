import { getStorage } from 'firebase-admin/storage';
import app from './app';
import { v4 as uuidv4 } from "uuid";

const storage = getStorage(app);

async function uploadFile(file: Express.Multer.File, path: string) {
  const uuid = uuidv4();
  const bucket = storage.bucket();
  const fileName = `${path}/${uuid}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: { contentType: file.mimetype },
  });

  const fileUrl = await new Promise<string>((resolve, reject) => {
    stream.on('error', (error) => {
      console.error(error);
      reject('Falha no envio do arquivo. Tente novamente mais tarde.');
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(fileUrl);
    });

    stream.end(file.buffer);
  });

  return fileUrl;
}

export { uploadFile };
