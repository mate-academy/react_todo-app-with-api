import { FC } from 'react';

type Props = {
  errorMessage: string,
  hideError : () => void
};

export const ErrorNotification: FC<Props> = ({ errorMessage, hideError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Hide Error"
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
};
