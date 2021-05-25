class ApiError extends Error {
  errorCode: number;
  constructor(msg: string, public eCode?: number) {
    super(msg);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    this.name = 'ApiError';
    this.errorCode = eCode === undefined ? 500 : eCode;
  }
}

export { ApiError };
