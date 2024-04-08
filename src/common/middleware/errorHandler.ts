/* Libraries */
import { Request, Response, NextFunction } from "express";

/* Application Modules */
import { ApiError } from "../exceptions/APIError";
import responseHandler from "../responseHandler";
import { logger } from "../../config/logger";

export function errorHandler(
  error: ApiError, 
  req: Request, 
  res: Response,
  next: NextFunction
) {
  logger.error(error.stack);
  const statusCode = error.status;

  const res_body = {
    status: "Failed",
    message: error.message,
  }

  
  return responseHandler.customResponse(statusCode, res_body, res);
}

export const routeNotFoundErrorHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  responseHandler.customResponse(404, { message: "Route not found" }, res);
  return next();
}
