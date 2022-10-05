import classNames from 'classnames';
import { useEffect } from 'react';

export enum ErrorType {
  None = 'no err',
  Blanc = 'Title can not be empty',
  AddingOne = 'Unable to add a todo',
  LoadingAll = 'Unable to load a list of todos. Check if your link is correct',
  DeletingOne = 'Unable to delete a todo',
  UpdatingOne = 'Unable to update a todo',
}

type Props = {
  closeError: (error: boolean) => void;
  error: boolean;
  errorType: string;
  setErrorType: (error: ErrorType) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  closeError, error, errorType, setErrorType,
}) => {
  const handleWindowClose = () => {
    closeError(true);
    setErrorType(ErrorType.None);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeError(true);
      setErrorType(ErrorType.None);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: error },
      )}
    >
      <button
        aria-label="Hide Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleWindowClose}
      />
      {errorType}
    </div>
  );
};
