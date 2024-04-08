import httpStatus from "http-status";

export interface IResponseError {
  message: string;
  additionalInfo?: string;
}

export class ApiError extends Error {
  message!: string;
  status!: number;
  additionalInfo!: any

  constructor(message: string, status: number, additionalInfo: any = undefined) {
    super(message)
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}

export class ClientError extends ApiError {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, httpStatus.NOT_FOUND);
  }
}

export class ServerError extends ApiError {
  constructor(message: string, additionalInfo?: any) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, additionalInfo);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, httpStatus.FORBIDDEN);
  }
}
