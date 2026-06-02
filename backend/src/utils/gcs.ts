import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'gurubantu-documents';
const PROJECT_ID = process.env.GCS_PROJECT_ID;
const CLIENT_EMAIL = process.env.GCS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GCS_PRIVATE_KEY ? process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

let storage: Storage | null = null;
let useLocalFallback = true;

if (PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY) {
  try {
    storage = new Storage({
      projectId: PROJECT_ID,
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
    });
    useLocalFallback = false;
    console.log('[Storage] Google Cloud Storage Client initialized successfully.');
  } catch (error) {
    console.error('[Storage] Failed to initialize Google Cloud Storage, falling back to local storage:', error);
  }
} else {
  console.log('[Storage] GCP Credentials missing. Using Local Storage Fallback.');
}

// Lokal folder pengunggahan di backend/uploads
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../../uploads');

/**
 * Mengunggah berkas buffer ke GCS atau sistem penyimpanan lokal fallback
 * @param buffer Berkas binary buffer
 * @param destinationPath Jalur penyimpanan berkas (misal: 'rpp/test.docx')
 * @param mimeType Mime-type dari berkas
 */
export const uploadFile = async (
  buffer: Buffer,
  destinationPath: string,
  mimeType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
): Promise<string> => {
  if (useLocalFallback) {
    const fullPath = path.join(LOCAL_UPLOAD_DIR, destinationPath);
    const dir = path.dirname(fullPath);
    
    // Pastikan direktori folder lokal ada
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await fs.promises.writeFile(fullPath, buffer);
    console.log(`[Storage-Fallback] File successfully written to local path: ${fullPath}`);
    return destinationPath;
  }

  // Mode Google Cloud Storage
  const bucket = storage!.bucket(BUCKET_NAME);
  const file = bucket.file(destinationPath);
  
  await file.save(buffer, {
    metadata: { contentType: mimeType },
    resumable: false,
  });
  
  console.log(`[Storage-GCS] File successfully uploaded to bucket ${BUCKET_NAME}: ${destinationPath}`);
  return destinationPath;
};

/**
 * Menghasilkan URL unduh berkas yang valid selama 24 jam
 * @param destinationPath Jalur berkas di database
 */
export const getSignedUrl = async (destinationPath: string): Promise<string> => {
  if (useLocalFallback) {
    const port = process.env.PORT || 8080;
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
    return `${backendUrl}/uploads/${destinationPath}`;
  }

  // Mode Google Cloud Storage
  const bucket = storage!.bucket(BUCKET_NAME);
  const file = bucket.file(destinationPath);

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 jam
  });

  return url;
};

/**
 * Menghapus berkas dari penyimpanan
 * @param destinationPath Jalur berkas yang ingin dihapus
 */
export const deleteFile = async (destinationPath: string): Promise<void> => {
  if (useLocalFallback) {
    const fullPath = path.join(LOCAL_UPLOAD_DIR, destinationPath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      console.log(`[Storage-Fallback] File successfully deleted locally: ${fullPath}`);
    }
    return;
  }

  // Mode Google Cloud Storage
  const bucket = storage!.bucket(BUCKET_NAME);
  const file = bucket.file(destinationPath);
  
  await file.delete();
  console.log(`[Storage-GCS] File successfully deleted from bucket ${BUCKET_NAME}: ${destinationPath}`);
};
