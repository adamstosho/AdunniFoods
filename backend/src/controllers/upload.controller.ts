import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(501).json({ message: 'Cloudinary not configured' });
  try {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: 'adunni', resource_type: 'image' }, (error, uploadResult) => {
      if (error || !uploadResult) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ message: 'Upload failed' });
      }
      return res.json({ message: 'ok', response: { url: uploadResult.secure_url } });
    });
    Readable.from(req.file.buffer).pipe(stream);
  } catch (e) {
    return res.status(500).json({ message: 'Upload failed' });
  }
}

export default { uploadImage };


