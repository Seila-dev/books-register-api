
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

// Configuração do Cloudinary com as credenciais do .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do storage para o Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'biblioteca/covers', // Nome da pasta no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Redimensionamento opcional
    // public_id: (req, file) => {
    //   // Você pode personalizar o nome do arquivo aqui se quiser
    //   const filename = path.parse(file.originalname).name;
    //   return `${Date.now()}-${filename}`;
    // }
  } as any // Typecasting necessário devido a limitações do tipo
});

// Configuração do Multer com Cloudinary
const uploadConfig = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  },
});

// Função para excluir imagem do Cloudinary
const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Erro ao excluir imagem do Cloudinary:', error);
    return false;
  }
};

// Função para extrair o public_id de uma URL Cloudinary ou path
const extractPublicId = (imageUrl: string): string => {
  // Verifica se é uma URL do Cloudinary
  if (imageUrl.includes('cloudinary.com')) {
    // Exemplo URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/biblioteca/covers/image.jpg
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    return `${folder}/${path.parse(filename).name}`;
  }
  
  // Se for apenas o nome do arquivo
  return `biblioteca/covers/${path.parse(imageUrl).name}`;
};

export { uploadConfig, deleteImage, extractPublicId, cloudinary };