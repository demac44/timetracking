export class ApiError extends Error {
  readonly status: number;
  readonly retryAt?: number;

  constructor(status: number, message: string, retryAt?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAt = retryAt;
  }
}
