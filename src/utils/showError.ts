export const showError = (
  setError: (message: string) => void,
  message: string,
  duration = 3000,
) => {
  setError(message);
  setTimeout(() => setError(''), duration);
};
