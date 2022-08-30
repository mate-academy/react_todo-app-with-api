import React, { useEffect } from 'react';
import { ErrorType } from '../../Enums/ErrorType';

type Props = {
  errorType: number,
  setErrorType: CallableFunction,
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { errorType, setErrorType } = props;

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.Default);
    }, 3000);
  }, []);

  const getErrorText = (): string => {
    switch (errorType) {
      case ErrorType.Delete:
        return 'Unable to delete a todo';
      case ErrorType.Add:
        return 'Unable to add a todo';
      case ErrorType.Update:
        return 'Unable to update a todo';
      case ErrorType.WrongTitle:
        return 'Title can\'t be empty';
      case ErrorType.Create:
        return 'Unable to add a todo';
      case ErrorType.Default:
      default:
        return '';
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(ErrorType.Default)}
      />

      {getErrorText()}
    </div>
  );
};
