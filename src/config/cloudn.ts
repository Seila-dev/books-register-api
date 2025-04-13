import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};

export const extractPublicId = (url: string): string => {
  const parts = url.split('/');
  const fileWithExtension = parts[parts.length - 1];
  const folder = parts.slice(parts.indexOf('upload') + 1, parts.length - 1).join('/');
  const fileName = fileWithExtension.split('.')[0];
  return `${folder}/${fileName}`;
};


export { cloudinary };
