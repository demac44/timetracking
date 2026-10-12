export interface SaveFailure {
  code: number;
  message: string;
  retryAt?: number;
}
