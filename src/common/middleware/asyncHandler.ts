import { Request, Response, NextFunction } from "express";

type RequestHandler = (req: Request, res: Response) => Promise<any>;

/**
 * Async handler to wrap the API routes handler, allowing for async error handling.
 * @param requestHandler Function to call for the API endpoint
 * @returns Promise with a catch statement
 */
const asyncHandler = (requestHandler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestHandler(req, res)
  } catch (error) {
    next(error);
  }
}

export default asyncHandler;