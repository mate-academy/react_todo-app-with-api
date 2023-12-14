// hideErrorMessage.tsx
const hideErrorMessage = (
  setErrorMessage: (errorMessage: string) => void,
  setIsErrorHidden: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setErrorMessage('');
  setIsErrorHidden(true);
};

export default hideErrorMessage;
