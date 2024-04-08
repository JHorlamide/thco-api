/* Libraries */
import { Request, Response } from "express";

/* Application Module */
import responseHandler from "../../../common/responseHandler";
import asyncHandler from "../../../common/middleware/asyncHandler";
import mediaService from "../service/service"
import { uploadMedia } from "../../../common/service/cloudinary";

class MediaController {
  uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return responseHandler.badRequest("File upload required. Please upload a file.", res);
    }

    const dataURI = mediaService.getDataURI(file);
    const response = await uploadMedia(dataURI);

    const uploadedFile = await mediaService.uploadMedia({
      media_url: response.secure_url,
      key: Date.now().toString()
    });

    responseHandler.successResponse("Media uploaded successfully", uploadedFile, res);
  })
}

export default new MediaController();