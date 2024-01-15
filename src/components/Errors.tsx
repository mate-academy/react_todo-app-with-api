import { Dispatch, SetStateAction } from 'react';
import cn from 'classnames';
import { ErrorMesage } from '../types/ErrorIMessage';

interface Props {
  errorMessage: ErrorMesage,
  setErrorMessage: Dispatch<SetStateAction<ErrorMesage>>
}

export const Errors: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const handleCloseErrors = () => {
    setErrorMessage(ErrorMesage.noErrors);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="hide error button"
        className={cn('delete', { hidden: !errorMessage })}
        onClick={handleCloseErrors}
      />
      {errorMessage}
      <br />
    </div>
  );
};
