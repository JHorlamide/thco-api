// Core
import fs from "fs";

// Libraries
import Joi from "joi";
import { Response, Request, NextFunction } from "express";

// Application Modules
import responseHandler from "../../../common/responseHandler";
import { multerUpload } from "../../../config/multerConfig";
import config from "../../../config/appConfig";

const fileUploadSchema = Joi.object({
  file: Joi.object({
    size: Joi.number().max(config.MAX_FILE_SIZE).required(),
  }).unknown(true).required(),
})

class MediaMiddleware {
  public validateUploadedFile(req: Request, res: Response, next: NextFunction) {
    const allowedFileType = {
      fileTypes: /jpg|jpeg|png|gif|mp4|avi|mov/,
      error_message: "Only images, gif, and video file type are allowed!"
    }

    const multerValidation = multerUpload(allowedFileType);

    multerValidation(req, res, async (validationError) => {
      if (validationError) {
        return responseHandler.badRequest(validationError.message || validationError, res);
      }

      const { error } = fileUploadSchema.validate({ file: req.file });

      if (error) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return responseHandler.badRequest(error.details[0].message, res);
      }

      next();
    })
  }
}

export default new MediaMiddleware();
