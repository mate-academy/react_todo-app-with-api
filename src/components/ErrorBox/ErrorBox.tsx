import { FC, useContext } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../context/TodoError';

type TTodoErrorProps = {
  hasAddTodoErrorTimerId: { current: number }
  hasGetTodoErrorTimerId: { current: number }
  hasDeleteTodoErrorTimerId: { current: number }
  hasUpdateTodoErrorTimerId: { current: number }
  inputFieldRef: { current: HTMLInputElement | null }
};

export const ErrorBox: FC<TTodoErrorProps> = ({
  hasAddTodoErrorTimerId,
  hasGetTodoErrorTimerId,
  hasDeleteTodoErrorTimerId,
  hasUpdateTodoErrorTimerId,
  inputFieldRef,
}) => {
  const { setErrorMessage, errorMessage } = useContext(ErrorMessage);

  const handleCloseClick = () => {
    setErrorMessage('');

    clearTimeout(hasAddTodoErrorTimerId.current);
    clearTimeout(hasGetTodoErrorTimerId.current);
    clearTimeout(hasDeleteTodoErrorTimerId.current);
    clearTimeout(hasUpdateTodoErrorTimerId.current);

    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="delete"
        onClick={handleCloseClick}
      />
      {errorMessage}
    </div>
  );
};
