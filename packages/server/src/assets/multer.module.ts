import { MulterModule as Multer } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const MulterModule = Multer.register({
  storage: diskStorage({
    destination: './public/upload/',
    filename: (req, file, callback) => callback(null, uuidv4()),
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
