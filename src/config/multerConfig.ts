/* Core */
import path from 'path';

/* Libraries */
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

/* Application Modules */
import config from './appConfig';
import { ClientError } from '../common/exceptions/APIError';

export interface AllowedFileType {
  file_types?: RegExp;
  error_message: string;
}

export function checkFileType(file: any, callBack: any, allowed_file_type: AllowedFileType) {
  const { file_types, error_message } = allowed_file_type;
  const fileExtName = path.extname(file.originalname).toLowerCase();

  if (file_types?.test(fileExtName) && file_types?.test(file.mimetype)) {
    return callBack(null, true);
  }

  return callBack(new ClientError(error_message));
};

export const multerUpload = (allowed_file_type: AllowedFileType) => {
  return multer({
    limits: { fileSize: config.MAX_FILE_SIZE },
    storage: multer.memoryStorage(),
    fileFilter: function (req: Request, file: Express.Multer.File, callBack: FileFilterCallback) {
      checkFileType(file, callBack, allowed_file_type);
    }
  }).single("file");
};
