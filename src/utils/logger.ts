export const logError = (message: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(message, error);
  }
};
