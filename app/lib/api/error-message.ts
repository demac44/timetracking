export function describeApiError(status: number, message: string) {
  if (status === 429) {
    return "Too many requests to Memtime. Please wait a moment.";
  }

  if (status === 0 || status === 503 || status === 504) {
    return "Couldn't reach Memtime. Check your connection and try again.";
  }

  if (status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  return message;
}
