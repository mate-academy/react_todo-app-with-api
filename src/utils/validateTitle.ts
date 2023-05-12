export const validateTitle = (inputTitle: string) => {
  if (inputTitle.trim() === '') {
    return "Title can't be empty";
  }

  if (!/^[a-zA-Z0-9]+$/.test(inputTitle.trim())) {
    return "Title can't contain only symbols";
  }

  return null;
};
