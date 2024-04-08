import { ServerError } from "../../../common/exceptions/APIError";
import Media, { IMedia } from "../model/Media";

class MediaService {
  async uploadMedia(media: IMedia) {
    try {
      const image = new Media(media);
      return await image.save();
    } catch (error: any) {
      throw new ServerError(error.message);
    }
  }

  getDataURI(file: Express.Multer.File): string {
    const base64 = Buffer.from(file.buffer).toString("base64");
    const data_uri = "data:" + file.mimetype + ";base64," + base64;
    return data_uri;
  }
}

export default new MediaService();