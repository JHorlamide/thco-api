import { Response } from "express";
import HttpStatus, { } from "http-status";
import httpStatus from "http-status";

/**
 * A class for handling HTTP responses with generic data type T.
 * Provides methods for successful, failure, and error responses.
 */
class ResponseHandler<T extends object> {
  public successfullyCreated(message: string, data: T, res: Response): Response {
    return res
      .status(HttpStatus.CREATED)
      .json({ status: "Success", message, data })
  }

  public successResponse(message: string, data: T, res: Response): Response {
    return res
      .status(HttpStatus.OK)
      .json({ status: "Success", message, data })
  }

  public noContentRes(res: Response) {
    return res.status(httpStatus.NO_CONTENT).json({ status: "Success" });
  }

  public badRequest(message: string, res: Response): Response {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ status: "Failure", message })
  }

  public unAuthorizedResponse(message: string, res: Response): Response {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: "Failure", message })
  }

  public forbiddenResponse(message: string, res: Response): Response {
    return res
      .status(HttpStatus.FORBIDDEN)
      .json({ status: "Failure", message })
  }

  public serverError(message: string, res: Response): Response {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, message })
  }

  public customResponse(status: number, res_body: any, res: Response): Response {
    return res
      .status(status)
      .json({ ...res_body });
  }
}

export default new ResponseHandler();
