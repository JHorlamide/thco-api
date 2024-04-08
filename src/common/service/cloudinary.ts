/* Libraries */
import cloudinary, { ConfigOptions } from "cloudinary";

/* Application Module */
import config from "../../config/appConfig";
import { ServerError } from "../exceptions/APIError";

cloudinary.v2.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secrete
})

export async function uploadMedia(file: string) {
  try {
    const cloudinaryOption: ConfigOptions = {
      resource_type: "auto",
      folder: "Image",
      secure: true
    }

    return await cloudinary.v2.uploader.upload(file, cloudinaryOption);
  } catch (error: any) {
    throw new ServerError(error.message);
  }
}