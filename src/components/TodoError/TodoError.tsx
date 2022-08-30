import { useMemo } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  currentError: ErrorType,
  setCurrentError: CallableFunction,
};

export const TodoError: React.FC<Props> = ({
  currentError,
  setCurrentError,
}) => {
  const closeErrorMsgHandler = () => {
    setCurrentError(ErrorType.noError);
  };

  const errorMsg = useMemo(() => {
    setTimeout(closeErrorMsgHandler, 3000);
    switch (currentError) {
      case ErrorType.whenEmptyTitle:
        return 'Title can`t be empty';
      case ErrorType.whenAddTodo:
        return 'Unable to add a todo';
      case ErrorType.whenDeleteTodo:
        return 'Unable to delete a todo';
      case ErrorType.whenChangeStatus:
        return 'Unable to change the status';
      case ErrorType.whenChangeTitle:
        return 'Unable to change the title';
      default:
        return '';
    }
  }, [currentError]);

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
        onClick={() => (closeErrorMsgHandler())}
      />
      {errorMsg}
    </div>
  );
};
